import requests
import json
from pprint import pprint as pp
from google.cloud import bigquery
from datetime import datetime

# Replace with your actual Google Places API key
API_KEY = "<PUT_YOUR_API_KEY_HERE>"
BASE_URL = "https://maps.googleapis.com/maps/api/place/"

def text_search_places(query, api_key):
    """
    Performs a text search for places based on a query.

    Args:
        query (str): The text query to search for (e.g., "restaurants in New York").
        api_key (str): Your Google Places API key.

    Returns:
        dict: A dictionary containing the API response, or None if an error occurs.
    """
    endpoint = "textsearch/json"
    params = {
        "query": query,
        "key": api_key
    }

    try:
        response = requests.get(f"{BASE_URL}{endpoint}", params=params)
        response.raise_for_status()  # Raise an exception for HTTP errors (4xx or 5xx)
        return response.json()
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
    # BigQuery settings
    PROJECT_ID = "foundestra"  # Replace with your project ID
    DATASET_ID = "places_data"
    TABLE_ID = "search_results"

    search_query = "touristic attractions in Kerala"
    places_data = text_search_places(search_query, API_KEY)

    if places_data:
        if places_data.get("status") == "OK":
            print(f"Found {len(places_data.get('results', []))} places")
            
            # Write to BigQuery
            write_to_bigquery(places_data, PROJECT_ID, DATASET_ID, TABLE_ID)

            # Write results to JSON file
            output_file = "places_results.json"
            try:
                with open(output_file, 'w') as f:
                    json.dump(places_data, f, indent=2)
                print(f"Results have been saved to {output_file}")
            except IOError as e:
                print(f"Error writing to file: {e}")

            # Print results to console
            for place in places_data.get("results", []):
                pp(place)
                print("-" * 20)
        else:
            print(f"API returned status: {places_data.get('status')}")
            print(f"Error message: {places_data.get('error_message', 'No error message provided.')}")
    else:
        print("Failed to retrieve places data.")

