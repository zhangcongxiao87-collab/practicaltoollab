import type { MetadataRoute } from "next";

const tools = [
  "json-formatter",
  "json-diff",
  "json-to-csv",
  "jwt-decoder",
  "base64-encoder-decoder",
  "nginx-log-analyzer",
  "url-encoder-decoder",
  "regex-tester",
  "timestamp-converter",
  "cidr-calculator",
  "cron-expression-tool",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.practicaltoollab.com";
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: baseUrl,
          "zh-CN": `${baseUrl}/zh`,
        },
      },
    },
    {
      url: `${baseUrl}/zh`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: baseUrl,
          "zh-CN": `${baseUrl}/zh`,
        },
      },
    },
  ];

  for (const tool of tools) {
    const englishUrl = `${baseUrl}/tools/${tool}`;
    const chineseUrl = `${baseUrl}/zh/tools/${tool}`;
    const alternates = {
      languages: {
        en: englishUrl,
        "zh-CN": chineseUrl,
      },
    };
    pages.push(
      {
        url: englishUrl,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates,
      },
      {
        url: chineseUrl,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75,
        alternates,
      },
    );
  }
  return pages;
}
