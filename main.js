import { performResearch } from "./researcher.js";

const [prompt] = Deno.args;
if (!prompt) {
  console.error("Usage: deno run -A main.js <prompt>");
  Deno.exit(1);
}
async function main() {
  try {
    console.log("Researching...");
    const result = await performResearch(prompt);
    await Deno.writeTextFile("./result.md", result[0].message.content);
    console.log("Done! See result.md for output");
  } catch (error) {
    console.error("Error during research:", error);
  }
}

main();
