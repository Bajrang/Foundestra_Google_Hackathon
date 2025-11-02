# MCP Toolbox — Credentials & Multi-App Tooling

This folder contains a small toolbox for managing downstream micro-app credentials and simple HTTP/postgres tools for the Foundestra project.

What this adds
- `tools.yaml` — extended with:
  - a `credentials-db` source (Cloud SQL Postgres)
  - Postgres tools `create-credential`, `get-latest-credential` for storing/retrieving JSON credentials
  - HTTP wrapper tools for `itinerary`, `activities`, and `places` micro-apps
  - a `multi_app_toolset` grouping those tools
  - placeholder credential entries (under `tools:`) that the loader can insert into the DB
- `migrations/001_create_credentials_table.sql` — creates a `credentials` table
- `load_tools_credentials.py` — script that reads `tools.yaml` and inserts credential-like entries into the DB
- `.env.sample` — sample env for DB connection
- `requirements.txt` — pip requirements for the loader script

Why
- Storing micro-app credentials in a managed database (Cloud SQL) allows tools/agents to look up credentials programmatically, rotate secrets by inserting new rows, and centralize access control.

Quick architecture
- `tools.yaml` continues to define tools used by the agent/tooling system.
- Credential entries (tools with a `credentials` or `credentials_json` field, or whose tool key contains `credential`) are discovered by the loader and inserted into the `credentials` table.
- At runtime, agents/tools can call the `get-latest-credential` Postgres tool (or `create-credential`) to read or store credentials.

Prerequisites
- gcloud authenticated and authorized to access the Cloud SQL instance.
- Cloud SQL Auth Proxy (or public IP + authorized network) so your local machine can reach the Cloud SQL instance.
- Python 3.8+ and virtualenv (for the loader): `python3 -m venv .venv`
- (Optional) `psql` if you prefer to run SQL locally; otherwise use `gcloud sql connect` or dockerized psql.

Files
- `tools.yaml` — main tools definition (edited)
- `migrations/001_create_credentials_table.sql` — SQL migration to create `credentials`
- `load_tools_credentials.py` — loader script
- `.env.sample` — example DB envs
- `requirements.txt` — `psycopg2-binary`, `PyYAML`, `python-dotenv`

Setup and usage

1) Prepare DB connectivity

- Option A: Cloud SQL Auth Proxy (recommended)
  - Download and run the proxy bound to `127.0.0.1:5432`:
    ```bash
    # macOS (Intel)
    curl -o cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.darwin.amd64 && chmod +x cloud_sql_proxy
    # macOS (arm64)
    # curl -o cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.darwin.arm64 && chmod +x cloud_sql_proxy

    ./cloud_sql_proxy -instances=PROJECT:REGION:INSTANCE=tcp:127.0.0.1:5432 &
    ```

- Option B: gcloud (interactive psql)
  ```bash
  gcloud sql connect hoteldb-instance --user=postgres --project=foundestra
  # inside psql: \i migrations/001_create_credentials_table.sql
  ```

- Option C: dockerized psql (no psql install)
  ```bash
  docker run --rm -e PGPASSWORD=postgres -v "$(pwd)":/workspace postgres:15 \
    psql -h host.docker.internal -p 5432 -U postgres -d postgres -f /workspace/migrations/001_create_credentials_table.sql
  ```

2) Apply the migration (create the `credentials` table)

Use one of the options above to run the SQL in `migrations/001_create_credentials_table.sql`.

3) Prepare the loader environment

```bash
cd mcp-toolbox
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Point the loader to the DB (if using the proxy, DB_HOST=127.0.0.1)
export DB_HOST=127.0.0.1
export DB_PORT=5432
export DB_NAME=postgres
export DB_USER=postgres
export DB_PASSWORD=postgres
```

4) Dry-run the loader to see what it would insert

```bash
python load_tools_credentials.py --file tools.yaml --dry-run
```

5) Insert detected credentials into the DB

If the dry-run output looks correct, run:

```bash
python load_tools_credentials.py --file tools.yaml
```
