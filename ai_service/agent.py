import os
from typing import Annotated, TypedDict, List, Dict, Any
from dotenv import load_dotenv
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langgraph.graph.message import add_messages

load_dotenv()

# Define the state structure
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    user_profile: Dict[str, Any]
    analysis: str

# Define interactive tools
@tool
def get_market_trends() -> str:
    """Retrieves real-time simulated market trends for digital assets and future markets at Aether Bank."""
    return (
        "AETHER COIN (ATH): +14.2% (Bullish trend driven by liquidity pool expansion).\n"
        "NEXUS CREDITS (NXS): -2.5% (Consolidating after smart contract upgrade).\n"
        "CARBON FUTURES (CRB): +8.7% (Increasing demand from elite-tier offsets)."
    )

@tool
def simulate_portfolio(assets: List[str], weights: List[float]) -> str:
    """Simulates a wealth portfolio performance over a 12-month period based on assets and percentage weights.
    Example assets: ['ATH', 'NXS', 'CRB']. Weights should sum to 100."""
    if len(assets) != len(weights):
        return "Error: Number of assets must match number of weights."
    if abs(sum(weights) - 100.0) > 0.1:
        return "Error: Portfolio weights must sum to 100%."
    
    returns = {
        "ATH": 0.18,
        "NXS": 0.05,
        "CRB": 0.10,
    }
    
    total_return = 0.0
    for asset, weight in zip(assets, weights):
        asset_return = returns.get(asset.upper(), 0.04)  # default 4% return
        total_return += asset_return * (weight / 100.0)
        
    projected_percentage = total_return * 100.0
    return (
        f"Projected Annual Return: +{projected_percentage:.2f}%\n"
        f"Simulation Details:\n" + \
        "\n".join([f" - {asset.upper()}: {weight}% allocation (projected yield: {returns.get(asset.upper(), 0.04)*100:.1f}%)" for asset, weight in zip(assets, weights)])
    )

@tool
def validate_transfer(recipient: str, amount: float) -> str:
    """Validates if a transfer exceeds safety thresholds or requires multi-factor authentication."""
    if amount > 500000:
        return f"REJECTED: Amount ${amount:,.2f} exceeds Elite Tier self-service limit of $500,000. Manual approval required."
    elif amount > 10000:
        return f"WARNING: Transfer of ${amount:,.2f} to {recipient} requires secondary cryptographic key signature."
    else:
        return f"APPROVED: Transfer of ${amount:,.2f} to {recipient} is pre-authorized."

# Initialize tools
tools = [get_market_trends, simulate_portfolio, validate_transfer]
tool_node = ToolNode(tools)

# Define the agent nodes
def financial_analyst(state: AgentState) -> Dict[str, Any]:
    """Evaluates the input, runs tools if required, and crafts financial strategies."""
    messages = state["messages"]
    
    system_prompt = (
        "You are Aether Intelligence, the elite AI Wealth Advisor for Aether Bank.\n"
        "Your style is futuristic, professional, highly analytical, and tailored to affluent tech-savvy users.\n"
        "Use the tools provided to retrieve market trends, simulate portfolio yields, or validate transfer amounts.\n"
        "Always provide structured, clear answers with clear headers. Format currency cleanly.\n"
        "Keep responses compact, highly informative, and suitable for a web dashboard interface."
    )
    
    # Initialize the LLM with tool binding
    google_api_key = os.getenv("GOOGLE_API_KEY")
    openai_api_key = os.getenv("OPENAI_API_KEY")
    
    if google_api_key:
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2, google_api_key=google_api_key)
    elif openai_api_key:
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2, api_key=openai_api_key)
    else:
        return {"messages": [AIMessage(content="System initializing. Please ensure API keys are configured.")]}
        
    llm_with_tools = llm.bind_tools(tools)
    
    response = llm_with_tools.invoke([SystemMessage(content=system_prompt)] + messages)
    return {"messages": [response]}

def risk_evaluator(state: AgentState) -> Dict[str, Any]:
    """Adds a layer of compliance, risk disclaimer, and risk level warning based on analysis."""
    messages = state["messages"]
    last_message = messages[-1]
    
    if not isinstance(last_message, AIMessage):
        return {}
        
    # Append a premium financial disclaimer signature
    disclaimer = (
        "\n\n---\n"
        "**[AETHER RISK TELEMETRY]:** All simulated allocations carry volatility risks. "
        "Smart contracts governing yield strategies are audited under Aether Protocol v4."
    )
    updated_content = last_message.content + disclaimer
    
    # Replace the last message with the updated content
    new_message = AIMessage(content=updated_content, additional_kwargs=last_message.additional_kwargs)
    return {"messages": messages[:-1] + [new_message]}

# Define the routing condition
def should_continue(state: AgentState) -> str:
    messages = state["messages"]
    last_message = messages[-1]
    # If the LLM requested a tool call, route to tools node
    if last_message.tool_calls:
        return "tools"
    return "risk_evaluator"

# Build the graph
workflow = StateGraph(AgentState)

workflow.add_node("financial_analyst", financial_analyst)
workflow.add_node("risk_evaluator", risk_evaluator)
workflow.add_node("tools", tool_node)

workflow.set_entry_point("financial_analyst")

# Add conditional edges
workflow.add_conditional_edges(
    "financial_analyst",
    should_continue,
    {
        "tools": "tools",
        "risk_evaluator": "risk_evaluator"
    }
)

# Connect tools back to analyst
workflow.add_edge("tools", "financial_analyst")
workflow.add_edge("risk_evaluator", END)

# Compile graph
agent_graph = workflow.compile()
