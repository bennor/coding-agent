import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";
import z from "zod";
import { type CodingAgentArgs, codingAgent } from "../../../utils/agent";
import { verifyToken } from "../../../utils/auth";

const agentRequestSchema = z.object({
  prompt: z.string(),
  repoUrl: z.string().url(),
  githubToken: z.string().optional(),
});

export async function POST(request: Request) {
  const isTokenValid = verifyToken(request, process.env.AUTH_TOKEN);

  if (!isTokenValid) {
    // Only perform bot check if auth token is invalid
    const verification = await checkBotId();

    if (verification.isBot) {
      return NextResponse.json(
        { error: "Bot detected. Access denied." },
        { status: 403 },
      );
    }

    // If not a bot, continue processing (don't return 401)
  }

  let args: CodingAgentArgs;
  try {
    const body = await request.json();
    args = agentRequestSchema.parse(body);
  } catch {
    return new Response(null, { status: 400 });
  }

  try {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const onProgress = (
          message: string,
          type: "thinking" | "result" | "complete",
        ) => {
          const data = { type, message, timestamp: Date.now() };
          controller.enqueue(encoder.encode(`${JSON.stringify(data)}\n`));
        };

        codingAgent({ ...args, onProgress })
          .then((result) => {
            const data = {
              type: "complete" as const,
              result,
              timestamp: Date.now(),
            };
            controller.enqueue(encoder.encode(`${JSON.stringify(data)}\n`));
            controller.close();
          })
          .catch((error) => {
            console.error(error);
            const data = {
              type: "error" as const,
              message: error.message || "An error occurred",
              timestamp: Date.now(),
            };
            controller.enqueue(encoder.encode(`${JSON.stringify(data)}\n`));
            controller.close();
          });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
