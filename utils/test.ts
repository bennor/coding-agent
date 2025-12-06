import dotenv from "dotenv";
import { codingAgent } from "./agent";

dotenv.config({ path: ".env.local" });
codingAgent({
  prompt: "Show me what this repo does without reading the README.",
  repoUrl: "https://github.com/bennor/coding-agent",
})
  .then(console.log)
  .catch(console.error);
