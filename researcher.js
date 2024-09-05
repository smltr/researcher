import OpenAI from "npm:openai";
import { visit } from "./puppet.js";

const apiKey = Deno.env.get("OPENAI_API_KEY");

if (!apiKey) {
  console.error("OPENAI_API_KEY is not set.");
  Deno.exit(1);
}

const openai = new OpenAI({ apiKey: apiKey });
const instructions = await Deno.readTextFile("./instructions.txt", "utf-8");

async function performResearch(prompt) {
  const messages = [
    { role: "user", content: instructions },
    { role: "user", content: `USER_PROMPT: ${prompt}` },
  ];

  const tools = [
    {
      type: "function",
      function: {
        name: "visit",
        description:
          "Visit a URL and return cleaned-up content stripped of HTML tags.",
        parameters: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "The URL to visit",
            },
          },
          required: ["url"],
        },
      },
    },
  ];

  let continueResearch = true;
  let finalResponse;

  while (continueResearch) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      tools: tools,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;
    messages.push(responseMessage);

    if (responseMessage.tool_calls) {
      for (const toolCall of responseMessage.tool_calls) {
        const functionName = toolCall.function.name;
        if (toolCall.function.name === "visit") {
          const functionArgs = JSON.parse(toolCall.function.arguments);
          const functionResponse = await visit(functionArgs.url);

          messages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: functionResponse,
          });
        }
      }
    } else {
      continueResearch = false;
      finalResponse = response;
    }
  }

  return finalResponse.choices;
}

export { performResearch };
