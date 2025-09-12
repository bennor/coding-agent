# JS/TS Coding Agent via Vercel AI SDK

This repo provides a coding agent API powered by Vercel AI SDK 5, Vercel AI Gateway, and Vercel Sandbox. The agent can:

- Read, list, and edit files in JavaScript/TypeScript repositories
- Create Pull Requests on GitHub with its changes
- Respond to freeform prompts to automate code modifications or PRs

## How It Works

Send a POST request to `/api/agent` with a prompt and a GitHub repository URL. The agent checks out the repo in an isolated Vercel Sandbox, uses a local LLM to reason about your prompt, reads/edits code, and creates a PR with its changes if needed.

## Example Usage

```bash
curl -X POST https://your-deployment.vercel.app/api/agent \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Replace lodash with native JS methods wherever possible",
    "repoUrl": "https://github.com/your-username/some-repo"
  }'
```

**Parameters:**
- `prompt` (string): What you want the agent to do
- `repoUrl` (string): Public GitHub repo URL
- `githubToken` (string, optional): Personal access token (if not set globally)

## Setup

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fship-25-agents-workshop-starter)

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy this repo on Vercel or clone/fork it
3. `vercel link` and `vercel env pull`
4. Install dependencies: `pnpm install`
5. Start locally: `vercel dev`

### Required Environment Variables

- `VERCEL_OIDC_TOKEN` — set automatically by Vercel
- `GITHUB_TOKEN` — GitHub personal access token with repo permissions

## About

This agent is designed to accelerate JS/TS repo automation, migrations, and refactors with LLM help. Uses API tools for file read/edit/list and PR creation.
