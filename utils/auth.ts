export function verifyToken(
  request: { headers: Headers },
  expectedToken: string | undefined
): boolean {
  const token = request.headers
    .get("authorization")
    ?.replace(/^Bearer /i, "")
    .trim();
  return !!expectedToken && token === expectedToken;
}
