import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from agent import agent_graph

app = FastAPI(title="Aether AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageModel(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[MessageModel]
    user_profile: Dict[str, Any] = {}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Convert request messages to langchain messages
        lc_messages = []
        for msg in request.messages:
            if msg.role == "user":
                lc_messages.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                lc_messages.append(AIMessage(content=msg.content))
            elif msg.role == "system":
                lc_messages.append(SystemMessage(content=msg.content))
                
        # Initialize state
        initial_state = {
            "messages": lc_messages,
            "user_profile": request.user_profile,
            "analysis": ""
        }
        
        # Execute the LangGraph workflow
        result = agent_graph.invoke(initial_state)
        
        # Extract the last message from the result
        last_message = result["messages"][-1]
        
        return {
            "role": "assistant",
            "content": last_message.content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
