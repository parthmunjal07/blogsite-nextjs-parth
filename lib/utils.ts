export function getRealIp(req: Request): string {
  // Extract real IP prioritizing Vercel's trusted proxy header over standard easily spoofable headers
  const vercelForwardedFor = req.headers.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) return vercelForwardedFor.split(",")[0].trim();

  // Next standard reliable headers
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  // Standard forwarded for (can be spoofed, take the leftmost as client IP)
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  // Fallback to connection socket IP if available on the Request object (NextRequest)
  if ('ip' in req && req.ip) return req.ip as string;

  return "unknown-ip";
}
