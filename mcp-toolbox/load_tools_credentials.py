#!/usr/bin/env python3
"""
Load credential entries from tools.yaml and insert them into a Postgres `credentials` table.
Usage:
  python load_tools_credentials.py --file tools.yaml

This script looks for entries in tools.yaml under 'tools' where the tool name contains 'credential' or where a 'credentials' field is present.
It inserts an entry with app_name set to the tool key or a provided app name, and credentials_json set to the YAML blob.

Note: run migrations first to create the `credentials` table.
"""

import argparse
import json
import os
import sys
from pathlib import Path

import yaml
import psycopg2
from psycopg2.extras import Json
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'postgres')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'postgres')


def get_conn():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
    )


def find_credentials_in_tools(tools_dict):
    """Heuristically find credential-like entries inside tools.yaml.
    Returns a list of tuples: (app_name, credentials_blob)
    """
    results = []
    for key, value in tools_dict.items():
        # If the tool key contains 'credential' treat the whole tool as a credential entry
        if 'credential' in key.lower():
            results.append((key, value))
            continue
        # If the tool has a field named 'credentials' or 'credentials_json', record it
        if isinstance(value, dict):
            if 'credentials' in value:
                results.append((key, value['credentials']))
            elif 'credentials_json' in value:
                results.append((key, value['credentials_json']))
    return results


def insert_credential(conn, app_name, cred_blob):
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO credentials (app_name, credentials_json) VALUES (%s, %s) RETURNING id, created_at",
            (app_name, Json(cred_blob)),
        )
        row = cur.fetchone()
        conn.commit()
        return row


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', '-f', default='tools.yaml', help='Path to tools.yaml')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be inserted')
    args = parser.parse_args()

    p = Path(args.file)
    if not p.exists():
        print('File not found:', p, file=sys.stderr)
        sys.exit(2)

    data = yaml.safe_load(p.read_text())
    tools = data.get('tools', {}) if isinstance(data, dict) else {}

    creds = find_credentials_in_tools(tools)
    if not creds:
        print('No credential-like entries found in', args.file)
        return

    print(f'Found {len(creds)} credential entries to load: {[c[0] for c in creds]}')

    if args.dry_run:
        for name, blob in creds:
            print('---', name)
            print(json.dumps(blob, indent=2, ensure_ascii=False))
        return

    conn = get_conn()
    try:
        for name, blob in creds:
            row = insert_credential(conn, name, blob)
            print(f'Inserted {name} -> id={row[0]}, created_at={row[1]}')
    finally:
        conn.close()


if __name__ == '__main__':
    main()
