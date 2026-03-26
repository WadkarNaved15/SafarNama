// // socket.server.js
// import { Server } from "socket.io";
// import { generateResponse } from "../functions/ai.js";
// import { HumanMessage, AIMessage } from "@langchain/core/messages";
// import messageModel from "../models/message.js";
// export const initializeSocket = (httpServer) => {
//   const io = new Server(httpServer, {
//     cors: {
//       origin: "*",
//     }
//   });

//   io.on("connection", (socket) => {
//     console.log("A user connected: " , socket.id);


//     socket.on("message", async (data) => {
//       try {
//         console.log("Message payload received:", data);
//         const { chatId, userId, content } = data;

//         if (!chatId || !content) {
//           return socket.emit("error", { message: "chatId and content are required." });
//         }
        

//         // 1. Save User's message to MongoDB
//         await messageModel.create({
//           user: userId,
//           chat: chatId,
//           content: content,
//           role: "user"
//         });

//         // 2. Fetch the latest 10 messages for this chat
//         const recentMessages = await messageModel.find({ chat: chatId })
//           .sort({ createdAt: -1 }) // Fetch newest first
//           .limit(10)
//           .lean();

//         // Sort chronologically for the AI context
//         recentMessages.reverse(); 
//         console.log("Recent messages for chat context:", recentMessages);

//         // 3. Format DB messages into LangChain message objects
//         const langChainMessages = recentMessages.map(msg => {
//           return msg.role === "model" 
//             ? new AIMessage(msg.content) 
//             : new HumanMessage(msg.content);
//         });
//         // After recentMessages.reverse()


//         // 4. Pass the array of LangChain messages to your LangGraph function
//         const aiResponseText = await generateResponse(langChainMessages);

//         // 5. Save the AI's response to MongoDB
//         await messageModel.create({
//           user: userId, // Optional for AI messages, but keeps schema happy
//           chat: chatId,
//           content: aiResponseText,
//           role: "model"
//         });

//         // 6. Emit the AI response back to the specific client
//         socket.emit("ai_response", {
//           chatId: chatId,
//           content: aiResponseText
//         });

//       } catch (error) {
//         console.error("Socket message error:", error);
//         socket.emit("error", { message: "Internal server error generating response." });
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected: " , socket.id);
//     });
//   });
// };

import { Server } from "socket.io";
import { generateResponse } from "../functions/ai.js";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import messageModel from "../models/message.js";

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("message", async (data) => {
      try {
        const { chatId, userId, content, image } = data; // 👈 destructure image

        if (!chatId || !content) {
          return socket.emit("error", { message: "chatId and content are required." });
        }

        // 1. Save user message to MongoDB
        // For image messages, save a readable placeholder instead of base64
        await messageModel.create({
          user: userId,
          chat: chatId,
          content: image ? `[User sent an image]: ${content}` : content,
          role: "user"
        });

        // 2. Fetch last 10 messages for context
        const recentMessages = await messageModel
          .find({ chat: chatId })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean();

        recentMessages.reverse();

        // 3. Build LangChain messages from history
        // History messages are always text — only the CURRENT message may have an image
        const historyMessages = recentMessages.slice(0, -1).map(msg =>
          msg.role === "model"
            ? new AIMessage(msg.content)
            : new HumanMessage(msg.content)
        );

        // 4. Build the current message — multimodal if image present
        let currentMessage;

        if (image?.base64 && image?.mimeType) {
          // Multimodal message with image + text
          currentMessage = new HumanMessage({
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${image.mimeType};base64,${image.base64}`
                }
              },
              {
                type: "text",
                text: content || "What place is this? Can you suggest similar destinations available on Safarnama?"
              }
            ]
          });
        } else {
          // Regular text message
          currentMessage = new HumanMessage(content);
        }

        const langChainMessages = [...historyMessages, currentMessage];

        // 5. Generate AI response
        const aiResponseText = await generateResponse(langChainMessages);

        // 6. Save AI response to MongoDB
        await messageModel.create({
          user: userId,
          chat: chatId,
          content: aiResponseText,
          role: "model"
        });

        // 7. Emit response back to client
        socket.emit("ai_response", { chatId, content: aiResponseText });

      } catch (error) {
        console.error("Socket message error:", error);
        socket.emit("error", { message: "Internal server error generating response." });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};