from google.cloud import run_v2
from google.cloud.run_v2.types import RunJobRequest
from google.api_core.exceptions import NotFound
import grpc
import argparse

def execute_cloud_run_job(project_id, region, job_name, image="gcr.io/cloudrun/hello"):
    client = run_v2.JobsClient()
    parent = f"projects/{project_id}/locations/{region}"
    full_name = f"{parent}/jobs/{job_name}"

    try:
        # Try to fetch existing job
        job = client.get_job(name=full_name)
        print(f"Found existing job: {full_name}")
    except Exception as e:
        # Handle gRPC _InactiveRpcError (grpc.RpcError) and google NotFound
        is_not_found = False
        if isinstance(e, NotFound):
            is_not_found = True
        elif isinstance(e, grpc.RpcError) and getattr(e, "code", lambda: None)() == grpc.StatusCode.NOT_FOUND:
            is_not_found = True

        if not is_not_found:
            # Unknown error — re-raise
            raise

        # Job doesn't exist — create a minimal job
        print(f"Job {full_name} not found. Creating job...")
        # IMPORTANT: do NOT set job.name on create; the server requires it to be empty.
        job = run_v2.Job(
            # Minimal execution template: single container
            template=run_v2.ExecutionTemplate(
                template=run_v2.TaskTemplate(
                    containers=[run_v2.Container(image=image)],
                    # adjust any other defaults as needed
                )
            )
        )
        op = client.create_job(parent=parent, job=job, job_id=job_name)
        print(f"Create job operation started: {getattr(op, 'name', getattr(op, 'operation', None))}")
        try:
            op.result()  # wait for creation
            print("Job creation completed.")
        except Exception as e2:
            print(f"Error waiting for job creation: {e2}")
            raise
        # Re-fetch the created job
        job = client.get_job(name=full_name)

    # Run the job
    request = RunJobRequest(name=full_name)
    run_op = client.run_job(request=request)
    print(f"Cloud Run Job {job_name} execution initiated: {getattr(run_op, 'name', run_op)}")
    return run_op

if __name__ == "__main__":
    """
    Run this script to create (if needed) and execute a Cloud Run Job.
    
    Example usage:
        # Run with defaults
        python app_connector_trigger_manual_sync.py
        
        # Run with custom values
        python app_connector_trigger_manual_sync.py \
            --project-id=my-project \
            --region=us-central1 \
            --job-name=my-connector-job \
            --image=gcr.io/my-project/my-image
    """
    parser = argparse.ArgumentParser(description="Create (if needed) and run a Cloud Run Job.")
    parser.add_argument("--project-id", default="foundestra", help="GCP project id (default: foundestra)")
    parser.add_argument("--region", default="us-east1", help="Job region (default: us-east1)")
    parser.add_argument("--job-name", default="test-app2-connector1-job", help="Cloud Run Job name (default: test-app2-connector1-job)")
    parser.add_argument("--image", default="gcr.io/cloudrun/hello", help="Container image to use when creating the job (default: gcr.io/cloudrun/hello)")
    args = parser.parse_args()

    execute_cloud_run_job(args.project_id, args.region, args.job_name, image=args.image)
