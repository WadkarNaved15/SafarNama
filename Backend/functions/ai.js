import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // Loads .env from the parent Backend folder

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StateGraph, Annotation } from "@langchain/langgraph";

// 1. Initialize Gemini
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.5-flash",
  temperature: 0.5,
});

// 2. Define the State (The Agent's Memory)
const TripState = Annotation.Root({
  messages: Annotation({
    // The reducer tells LangGraph to append new messages to the existing array
    reducer: (currentState, updateValue) => currentState.concat(updateValue),
    default: () => [],
  })
});

// 3. Define the Agent Node
async function callModel(state) {
  const messages = state.messages;

  // Set the AI's persona
  const systemMessage = new SystemMessage(
    "You are the Safarnama AI travel assistant. Keep your answers concise, friendly, and focused on travel planning."
  );

  // Invoke Gemini with the persona + user history
  const response = await llm.invoke([systemMessage, ...messages]);

  // Return the new message to update the State
  return { messages: [response] };
}

// 4. Build and Compile the Graph
const workflow = new StateGraph(TripState)
  .addNode("agent", callModel)       // Add our agent node
  .addEdge("__start__", "agent")     // Graph starts by routing to the agent
  .addEdge("agent", "__end__");      // Graph ends after the agent replies

const safarnamaAgent = workflow.compile();

// 5. Execute a Test Run
export async function generateResponse(MessagesHistory) {
  console.log("✈️ Starting Safarnama Agent...\n");

  

  // Run the graph with the input
  const finalState = await safarnamaAgent.invoke({ messages: MessagesHistory });

  // Extract the final AI response from the state's memory
  const aiResponse = finalState.messages[finalState.messages.length - 1];
  
  console.log("🤖 Safarnama AI:");
  console.log(aiResponse.content);
  return aiResponse.content;
}



