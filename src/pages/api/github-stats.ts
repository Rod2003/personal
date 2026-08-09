import type { NextApiRequest, NextApiResponse } from "next";
import { checkRateLimit, rateLimitResponse } from "../../helpers/rate-limit";
import config from "../../config/site.json";

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  name: string;
}

interface GitHubStats {
  totalStars: number;
  totalForks: number;
  publicRepos: number;
  topRepos: { name: string; stars: number }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GitHubStats | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const isAllowed = checkRateLimit(req, res, {
    maxRequests: 100,
    windowMs: 60 * 60 * 1000,
  });

  if (!isAllowed) {
    const resetTime = Date.now() + 60 * 60 * 1000;
    return res
      .status(429)
      .json({ error: `Rate limit exceeded. Please try again later.` });
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${config.social.github}/repos?per_page=100&sort=stars`
    );
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const repos = (await response.json()) as GitHubRepo[];

    const totalStars = repos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const topRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((repo) => ({ name: repo.name, stars: repo.stargazers_count }));

    return res.status(200).json({
      totalStars,
      totalForks,
      publicRepos: repos.length,
      topRepos,
    });
  } catch (error: any) {
    console.error("Error fetching GitHub stats:", error);
    return res.status(500).json({ error: "Failed to fetch GitHub stats" });
  }
}
