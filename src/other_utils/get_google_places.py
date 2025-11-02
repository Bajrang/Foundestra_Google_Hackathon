import requests
import json
from pprint import pprint as pp
from google.cloud import bigquery
from datetime import datetime
import time  # added to support waiting for next_page_token activation
import yaml  # added to read YAML config files

# Replace with your actual Google Places API key
BASE_URL = "https://maps.googleapis.com/maps/api/place/"

def load_config(config_file):
    """Load configuration from a YAML file."""
    with open(config_file, 'r') as file:
        return yaml.safe_load(file)

def text_search_places(query, api_key):
    """
    Performs a text search for places based on a query and follows pagination
    to return all results across pages.

    Args:
        query (str): The text query to search for (e.g., "restaurants in New York").
        api_key (str): Your Google Places API key.

    Returns:
        dict: A dictionary containing combined 'results' and 'status', or None if an error occurs.
    """
    endpoint = "textsearch/json"
    params = {
        "query": query,
        "key": api_key
    }

    try:
        combined_results = []
        seen_place_ids = set()

        while True:
            response = requests.get(f"{BASE_URL}{endpoint}", params=params)
            response.raise_for_status()
            data = response.json()

            # Merge unique results
            for place in data.get('results', []):
                pid = place.get('place_id')
                if pid and pid not in seen_place_ids:
                    seen_place_ids.add(pid)
                    combined_results.append(place)

            next_token = data.get('next_page_token')
            if not next_token:
                break

            # Next-page tokens may take a short time to become valid.
            # Wait before requesting the next page.
            time.sleep(2)
            params = {"pagetoken": next_token, "key": api_key}

        return {"results": combined_results, "status": "OK"}
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None


def write_to_bigquery(data, project_id, dataset_id, table_id):
    """
    Writes places data to BigQuery.
    
    Args:
        data (dict): Places API response data
        project_id (str): Google Cloud project ID
        dataset_id (str): BigQuery dataset ID
        table_id (str): BigQuery table ID
    """
    client = bigquery.Client(project=project_id)
    table_ref = f"{project_id}.{dataset_id}.{table_id}"
    
    # Transform the data for BigQuery
    rows_to_insert = []
    for place in data.get('results', []):
        row = {
            'place_id': place.get('place_id'),
            'name': place.get('name'),
            'address': place.get('formatted_address'),
            'rating': place.get('rating'),
            'latitude': place.get('geometry', {}).get('location', {}).get('lat'),
            'longitude': place.get('geometry', {}).get('location', {}).get('lng'),
            'types': place.get('types', []),  # Keep as array instead of converting to JSON string
            'timestamp': datetime.now().isoformat(),
            'business_status': place.get('business_status')
        }
        rows_to_insert.append(row)

    # Updated schema with ARRAY type for 'types' field
    schema = [
        bigquery.SchemaField('place_id', 'STRING'),
        bigquery.SchemaField('name', 'STRING'),
        bigquery.SchemaField('address', 'STRING'),
        bigquery.SchemaField('rating', 'FLOAT'),
        bigquery.SchemaField('latitude', 'FLOAT'),
        bigquery.SchemaField('longitude', 'FLOAT'),
        bigquery.SchemaField('types', 'STRING', mode='REPEATED'),  # REPEATED mode creates an array
        bigquery.SchemaField('timestamp', 'TIMESTAMP'),
        bigquery.SchemaField('business_status', 'STRING'),
    ]

    try:
        # Create the table if it doesn't exist
        table = bigquery.Table(table_ref, schema=schema)
        client.create_table(table, exists_ok=True)

        # Insert the rows
        errors = client.insert_rows_json(table_ref, rows_to_insert)
        if errors:
            print(f"Encountered errors while inserting rows: {errors}")
        else:
            print(f"Successfully inserted {len(rows_to_insert)} rows into BigQuery")
    except Exception as e:
        print(f"Error writing to BigQuery: {e}")



if __name__ == "__main__":
    # Load configuration
    config = load_config('config.yaml')  # Load from a YAML config file
    API_KEY = config['api_key']
    PROJECT_ID = config['bigquery']['project_id']
    DATASET_ID = config['bigquery']['dataset_id']
    TABLE_ID = config['bigquery']['table_id']
    search_queries = config['search_queries']  # List of search queries

    for search_query in search_queries:
        print(f"Searching for: {search_query}")
        places_data = text_search_places(search_query, API_KEY)

        if places_data:
            if places_data.get("status") == "OK":
                print(f"Found {len(places_data.get('results', []))} places")
                
                # Write to BigQuery
                write_to_bigquery(places_data, PROJECT_ID, DATASET_ID, TABLE_ID)

                # Write results to JSON file
                output_file = f"places_results_{search_query.replace(' ', '_')}.json"
                try:
                    with open(output_file, 'w') as f:
                        json.dump(places_data, f, indent=2)
                    print(f"Results have been saved to {output_file}")
                except IOError as e:
                    print(f"Error writing to file: {e}")

                # Print results to console
                for place in places_data.get("results", []):
                    pp(place['name'])
                    print("-" * 20)
            else:
                print(f"API returned status: {places_data.get('status')}")
                print(f"Error message: {places_data.get('error_message', 'No error message provided.')}")
        else:
            print("Failed to retrieve places data.")

