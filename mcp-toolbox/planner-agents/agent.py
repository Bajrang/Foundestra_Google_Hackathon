from google.adk.agents.llm_agent import Agent
#from google.adk.agents import Agent
from toolbox_core import ToolboxSyncClient

#toolbox = ToolboxSyncClient("http://127.0.0.1:5000")

CLOUD_RUN_SERVICE_URL = "https://toolbox-118156653607.us-central1.run.app"
toolbox = ToolboxSyncClient(CLOUD_RUN_SERVICE_URL)

# Load single tool
tools = toolbox.load_tool('search-hotels-by-location')

# Load all the tools
tools = toolbox.load_toolset('my_first_toolset')

root_agent = Agent(
    name="planner_agent",
    model="gemini-2.5-flash",
    description=(
        "Agent to answer questions about hotels in a city or hotels by name."
    ),
    instruction=(
        "You are a helpful agent who can answer user questions about the hotels in a specific city or hotels by name. Use the tools to answer the question"
    ),
    tools=tools,
)

# Function to get the agent
def get_agent() -> Agent:
    return root_agent
get_agent()

# Example usage
if __name__ == "__main__":
    response = root_agent.invoke(
        "Find me a hotel in New York City named 'The Plaza' and provide details about it."
    )
    print("Response:", response)