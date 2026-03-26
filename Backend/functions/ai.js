
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage } from "@langchain/core/messages";
import { StateGraph, Annotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

// ─── 1. Define the Search Tool ───────────────────────────────────────────────
const searchPackagesTool = tool(
  async ({ q, destination, category, difficulty, minPrice, maxPrice, rating }) => {
    try {
      const params = new URLSearchParams();
      if (q)           params.append("q", q);
      if (destination) params.append("destination", destination);
      if (category)    params.append("category", category);
      if (difficulty)  params.append("difficulty", difficulty);
      if (minPrice)    params.append("minPrice", String(minPrice));
      if (maxPrice)    params.append("maxPrice", String(maxPrice));
      if (rating)      params.append("rating", String(rating));

      const res = await fetch(`${BASE_URL}/api/v1/packages?${params.toString()}`);

      if (!res.ok) return `API error: ${res.status}`;

      const packages = await res.json();

      if (!packages.length) return "No packages found matching those criteria.";

      // Return a clean summary so the AI can narrate it nicely
      return packages.map(p =>
        `• *${p.title}* — ${p.destination} | ${p.duration} | ₹${p.price} | ⭐ ${p.rating} | ${p.category} (${p.difficulty})\n  ${p.description?.slice(0, 100)}...`
      ).join("\n\n");

    } catch (err) {
      return `Failed to fetch packages: ${err.message}`;
    }
  },
  {
    name: "search_packages",
    description: `Search available travel packages. Use this whenever a user asks about trips, packages, destinations, or travel options. Supports filtering by keyword, destination, category, difficulty, price range, and rating.`,
    schema: z.object({
      q:           z.string().optional().describe("General keyword search (title, destination, description)"),
      destination: z.string().optional().describe("Exact destination name e.g. 'Goa', 'Manali'"),
      category:    z.string().optional().describe("Package category e.g. 'Adventure', 'Family', 'Honeymoon'"),
      difficulty:  z.string().optional().describe("Difficulty level e.g. 'Easy', 'Moderate', 'Hard'"),
      minPrice:    z.number().optional().describe("Minimum price filter"),
      maxPrice:    z.number().optional().describe("Maximum price filter"),
      rating:      z.number().optional().describe("Minimum rating filter e.g. 4 for 4+ stars"),
    }),
  }
);
// ─── Destination Tools ────────────────────────────────────────────────────────

const searchDestinationsTool = tool(
  async ({ q, region, theme, season, country }) => {
    try {
      const params = new URLSearchParams();
      if (q)       params.append("q", q);
      if (region)  params.append("region", region);
      if (theme)   params.append("theme", theme);
      if (season)  params.append("season", season);
      if (country) params.append("country", country);

      const res = await fetch(`${BASE_URL}/api/v1/destinations?${params.toString()}`);
      if (!res.ok) return `API error: ${res.status}`;

      const destinations = await res.json();
      if (!destinations.length) return "No destinations found matching those criteria.";

      return destinations.map(d =>
        `• *${d.name}*, ${d.country} | Region: ${d.region} | Theme: ${d.theme} | Best Season: ${d.season}\n  ${d.description?.slice(0, 100)}...`
      ).join("\n\n");

    } catch (err) {
      return `Failed to fetch destinations: ${err.message}`;
    }
  },
  {
    name: "search_destinations",
    description: `Search available travel destinations. Use when user asks about places to visit, regions, countries, travel themes (adventure, beach, culture etc.) or best seasons to travel. Use this to inspire or shortlist destinations before searching packages.`,
    schema: z.object({
      q:       z.string().optional().describe("General keyword search across name, country, region"),
      region:  z.string().optional().describe("Geographic region e.g. 'South India', 'Himalayas', 'Southeast Asia'"),
      theme:   z.string().optional().describe("Travel theme e.g. 'Adventure', 'Beach', 'Cultural', 'Wildlife'"),
      season:  z.string().optional().describe("Best travel season e.g. 'Summer', 'Winter', 'Monsoon'"),
      country: z.string().optional().describe("Country name e.g. 'India', 'Thailand', 'Nepal'"),
    }),
  }
);

const getDestinationDetailsTool = tool(
  async ({ id }) => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/destinations/${id}`);
      if (!res.ok) return `API error: ${res.status}`;

      const { destination, packages } = await res.json();

      const destInfo = `📍 *${destination.name}*, ${destination.country}
Region: ${destination.region} | Theme: ${destination.theme} | Best Season: ${destination.season}
${destination.description}`;

      const pkgInfo = packages.length
        ? `\n\n🧳 Available Packages:\n` + packages.map(p =>
            `• *${p.title}* — ${p.duration} | ₹${p.price} | ⭐ ${p.rating} | ${p.difficulty}`
          ).join("\n")
        : "\n\nNo packages currently available for this destination.";

      return destInfo + pkgInfo;

    } catch (err) {
      return `Failed to fetch destination details: ${err.message}`;
    }
  },
  {
    name: "get_destination_details",
    description: `Get full details about a specific destination including its description and all available packages. Use this after search_destinations when the user wants to dive deeper into a particular place. Requires the destination's ID from search results.`,
    schema: z.object({
      id: z.string().describe("The destination's MongoDB ID from search_destinations results"),
    }),
  }
);

const tools = [searchPackagesTool,searchDestinationsTool, getDestinationDetailsTool];
const toolNode = new ToolNode(tools);

// ─── 2. Initialize Gemini with tools bound ───────────────────────────────────
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.5-flash",
  temperature: 0.5,
}).bindTools(tools); // 👈 key line

// ─── 3. State Definition ─────────────────────────────────────────────────────
const TripState = Annotation.Root({
  messages: Annotation({
    reducer: (currentState, updateValue) => currentState.concat(updateValue),
    default: () => [],
  })
});

// ─── 4. Agent Node ───────────────────────────────────────────────────────────
async function callModel(state) {
 const systemMessage = new SystemMessage(
  `You are Safarnama AI, a smart and friendly travel planning assistant for the Safarnama platform.

MEMORY & CONTEXT:
- You have full access to the conversation history in this session.
- When a user refers to something mentioned earlier, use that context — never say you lack memory.

YOUR TOOLS — use them proactively, never make up data:

1. search_destinations
   - Use when user asks about places, regions, countries, themes (beach, adventure, cultural etc.) or best travel seasons.
   - Use this FIRST to help users discover and shortlist destinations before looking at packages.

2. get_destination_details
   - Use after search_destinations when the user wants more info about a specific place.
   - Always use this before recommending packages for a destination — it returns real packages tied to that destination.

3. search_packages
   - Use when user asks about trips, tour packages, pricing, duration, or difficulty.
   - Can be used independently if user already knows their destination and wants packages directly.

TOOL CHAINING STRATEGY:
- "Where should I go for an adventure in winter?" → search_destinations first, then get_destination_details on user's pick.
- "Show me packages for Goa" → search_packages directly with destination: "Goa".
- "Tell me more about Manali" → get_destination_details with Manali's ID from prior search.
- Never suggest or describe a package/destination without calling the relevant tool first.
IMAGE UNDERSTANDING:
- When a user sends an image, analyze it to identify the location, landscape type, vibe, or travel theme.
- Use visual cues like geography, architecture, vegetation, and climate to make an inference.
- Immediately call search_destinations with relevant keywords (region, theme, season) based on what you see.
- If the exact location is on the platform, use get_destination_details for full info.
- If not an exact match, say so honestly and suggest the closest available alternatives.
- Example: snowy mountains → search_destinations({ theme: "Adventure", season: "Winter", region: "Himalayas" })
- Example: tropical beach → search_destinations({ theme: "Beach", country: "India" })
PERSONALITY:
- Concise, warm, and travel-enthusiastic.
- Use bullet points and emojis sparingly to keep responses scannable.
- Always end with a follow-up question or next step to keep the planning moving.`
);

  const response = await llm.invoke([systemMessage, ...state.messages]);
  return { messages: [response] };
}

// ─── 5. Routing Logic ─────────────────────────────────────────────────────────
// If the model called a tool, go to toolNode — otherwise end
function shouldContinue(state) {
  const lastMessage = state.messages.at(-1);
  return lastMessage.tool_calls?.length ? "tools" : "__end__";
}

// ─── 6. Build Graph ───────────────────────────────────────────────────────────
const workflow = new StateGraph(TripState)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)  // agent → tools OR end
  .addEdge("tools", "agent");                    // tools always loop back to agent

const safarnamaAgent = workflow.compile();

// ─── 7. Export ────────────────────────────────────────────────────────────────
export async function generateResponse(MessagesHistory) {
  const finalState = await safarnamaAgent.invoke({ messages: MessagesHistory });
  const aiResponse = finalState.messages.at(-1);
  return aiResponse.content;
}
