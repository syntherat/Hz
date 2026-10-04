import { site } from "@/lib/site";

// cached for an hour; the unauthenticated api allows 60 requests an hour per ip, so set GITHUB_TOKEN on the host
export async function getStars(): Promise<number | null> {
  const repo = site.github.match(/github\.com\/([^/]+\/[^/#?]+)/)?.[1];
  if (!repo) return null;
  const token = process.env.GITHUB_TOKEN;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json", ...(token && { Authorization: `Bearer ${token}` }) },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data: { stargazers_count?: unknown } = await res.json();
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export function formatStars(n: number) {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, "")}k`;
}
