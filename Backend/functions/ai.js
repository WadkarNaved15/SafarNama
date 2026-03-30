
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
  `You are Safarnama AI, an autonomous and proactive travel planning assistant. 
You have tools to search real data — use them aggressively and chain them without waiting for user permission.

AUTONOMOUS BEHAVIOR:
- Never ask "should I search for that?" — just search.
- If one tool call returns no results or insufficient info, immediately try again with broader or different parameters.
- Chain multiple tools in a single response when needed — don't wait for the user to ask follow-up questions.
- Always attempt at least one tool call before responding to any travel-related query.

MEMORY & CONTEXT:
- You have full access to the conversation history. Never claim you lack memory.
- Remember destinations, preferences, and budget constraints mentioned earlier and apply them automatically.

YOUR TOOLS:

1. search_destinations — use for places, regions, themes, seasons, countries, vibes
2. get_destination_details — use for detailed info + packages tied to a specific destination  
3. search_packages — use for trips, pricing, duration, difficulty, budget filters

TOOL CHAINING — always think in chains, not single calls:
- User asks about a destination → search_destinations → if results found, immediately get_destination_details on the best match → present both together
- User asks for packages → search_packages → if empty, broaden filters and search again
- User uploads an image → identify vibe/landscape → search_destinations with inferred theme/region → get_destination_details on top result
- User mentions budget → always pass it as minPrice/maxPrice to search_packages automatically

WHEN RESULTS ARE EMPTY OR PARTIAL — this is critical:
- Never say "nothing found" and stop. Always try at least 2-3 variations before giving up.
- Broaden the search: remove one filter, try a synonym, try a parent region (e.g. "Kerala" → "South India" → "India")
- If the exact destination doesn't exist on the platform, find the closest match using ANY of these signals:
    • Same theme (beach, mountains, heritage, wildlife)
    • Same season or climate
    • Same country or region
    • Similar difficulty or budget range
    • Similar vibe (romantic, adventurous, spiritual, family)
- Always present alternatives with a clear explanation: "We don't have [X] but here's why you'd love [Y] instead."
- Even 1 matching attribute is enough to suggest an alternative — never return empty-handed.

IMAGE UNDERSTANDING:
- Extract every possible signal: geography, architecture, vegetation, weather, colors, crowd type, activities visible.
- Translate signals into tool parameters: snowy peaks → theme:"Adventure", season:"Winter", region:"Himalayas"
- Run search_destinations, then immediately get_destination_details on the top result.
- If no exact match, find the closest visual/thematic equivalent available on the platform.

RESPONSE STYLE:
- Concise and warm. Use emojis and bullet points sparingly.
- Lead with the answer, follow with options, end with one specific question to move planning forward.
- When suggesting alternatives, be confident — never apologetic. Frame it as a recommendation, not a consolation.`
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
