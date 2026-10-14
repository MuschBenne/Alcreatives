import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * The AI crawlers are listed explicitly, and allowed.
 *
 * `userAgent: "*"` already permits them, so this changes nothing technically —
 * it is a stated position, kept visible so nobody has to guess whether the
 * silence was a decision or an oversight. A portfolio wants to be found, and
 * being absent from the models people now ask for a photographer is a cost with
 * no matching benefit. Remove a name here to opt that one out.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: "/api/",
      })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
