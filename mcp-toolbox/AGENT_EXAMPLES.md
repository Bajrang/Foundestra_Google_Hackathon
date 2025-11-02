# Agent / ADK Examples

This document contains example snippets showing how to call the ADK tools defined in `adk-tools.yaml`.

Prerequisites
- Cloud SQL Auth Proxy running or DB reachable via env vars:

```bash
export DB_HOST=127.0.0.1
export DB_PORT=5432
export DB_NAME=postgres
export DB_USER=postgres
export DB_PASSWORD=postgres
```

Example A — run a read tool (list-itineraries-by-user) using Python (psycopg2)

```python
# example_list_itineraries.py
import os
import psycopg2
from psycopg2.extras import RealDictCursor

conn = psycopg2.connect(
    host=os.getenv('DB_HOST','127.0.0.1'),
    port=int(os.getenv('DB_PORT',5432)),
    dbname=os.getenv('DB_NAME','postgres'),
    user=os.getenv('DB_USER','postgres'),
    password=os.getenv('DB_PASSWORD','postgres'),
)
with conn:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        owner = 'some_user_id'
        cur.execute(
            """
            SELECT id, title, destination_city_name, start_at_epoch, end_at_epoch, total_cost
            FROM itinerary
            WHERE owner_user_id = %s
            ORDER BY start_at_epoch DESC
            LIMIT 50;
            """,
            (owner,)
        )
        rows = cur.fetchall()
        print(rows)

```

Example B — run a write tool (create-itinerary) using Python (psycopg2)

```python
# example_create_itinerary.py
import os
import uuid
import psycopg2

conn = psycopg2.connect(
    host=os.getenv('DB_HOST','127.0.0.1'),
    port=int(os.getenv('DB_PORT',5432)),
    dbname=os.getenv('DB_NAME','postgres'),
    user=os.getenv('DB_USER','postgres'),
    password=os.getenv('DB_PASSWORD','postgres'),
)

it_id = str(uuid.uuid4())
with conn:
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO itinerary (id, owner_user_id, title, description, destination_city_name, start_at_epoch, end_at_epoch, total_cost)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
            """,
            (it_id, 'test_user', 'Test Trip', 'Created by ADK', 'Bengaluru', 1700000000, 1700008640, 10000)
        )
        new_id = cur.fetchone()[0]
        print('Created itinerary', new_id)

```

Example C — call HTTP wrapper tool (call-itinerary-generator) via curl

```bash
# This is a basic curl example if the HTTP tool points to an HTTP endpoint
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"destination":"Bengaluru","days":3,"budget":15000}' \
  http://itinerary-generator:3000/generate
```

Example D — using psql (quick test)

```bash
# Count itineraries
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) FROM itinerary;"

# Get a sample owner_user_id (if any)
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT owner_user_id FROM itinerary LIMIT 1;"
```

Notes
- The ADK runtime you use may automatically map `adk-tools.yaml` definitions to callable functions. The examples above show direct DB access using psycopg2 as a minimal reproducible example.
- For production use, validate inputs and ensure RBAC restricts write tools tightly.
