import z from "zod";
import { codingAgent } from "../utils/agent";
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

  try {
    const body = await request.json();
    const args = agentRequestSchema.parse(body);

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
