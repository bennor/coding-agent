import z from "zod";
import { type CodingAgentArgs, codingAgent } from "../utils/agent";
import { verifyToken } from "../utils/auth";

const agentRequestSchema = z.object({
  prompt: z.string(),
  repoUrl: z.string().url(),
  githubToken: z.string().optional(),
});

export async function POST(request: Request) {
  if (!verifyToken(request, process.env.AUTH_TOKEN)) {
    return new Response(null, { status: 401 });
  }

  let args: CodingAgentArgs;
  try {
    const body = await request.json();
    args = agentRequestSchema.parse(body);
  } catch {
    return new Response(null, { status: 400 });
  }

  try {
    const result = await codingAgent(args);
    return new Response(JSON.stringify({ result }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
