import dotenv from "dotenv";
import { codingAgent } from "./agent";

dotenv.config({ path: ".env.local" });
codingAgent(
  "Add a contributing section to the readme of this project. Use standard format.",
  "https://github.com/bennor/coding-agent",
)
  .then(console.log)
  .catch(console.error);
