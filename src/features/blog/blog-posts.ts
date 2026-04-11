/**
 * Blog data — static CMS.
 * Each post uses typed content blocks rendered by the blog renderer.
 * No raw HTML injection. Add a new entry here to add a new post.
 */

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading2"; text: string }
  | { type: "heading3"; text: string }
  | { type: "tldr"; items: string[] }
  | { type: "pull-quote"; text: string }
  | { type: "insight"; text: string }
  | { type: "citation"; text: string; source: string }
  | { type: "stat-row"; items: { num: string; label: string }[] }
  | { type: "user-grid"; items: { icon: string; title: string; body: string }[] }
  | { type: "feature-list"; items: { label: string; body: string }[] }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "cta"; heading: string; body: string; buttonText: string; href: string }
  | { type: "bar-chart"; title: string; caption: string; bars: { label: string; value: number; displayValue: string }[] }
  | { type: "bullet-list"; items: string[] }
  | { type: "checklist"; items: { icon: string; label: string; body: string }[] }
  | { type: "step-grid"; items: { num: string; title: string; body: string }[] }
  | { type: "source-table"; caption?: string; headers: string[]; rows: { cells: string[]; tag?: string; tagColor?: "green" | "emerald" | "amber" | "red" | "blue" | "purple" }[] };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  readingTimeMinutes: number;
  keywords: string[];
  content: ContentBlock[];
}

/** Lightweight metadata for the blog list page — no content included. */
export type BlogPostMeta = Omit<BlogPost, "content">;

export const blogPostsMeta: BlogPostMeta[] = [
  {
    slug: "industrial-thermography-bearing-fault-detection-dataset",
    title: "Industrial Thermography Dataset for Bearing Fault Detection: Predictive Maintenance & AI",
    description: "Explore the real-world industrial thermography dataset for bearing fault detection. Radiometric thermal images, temperature matrices, and pre-labeled Healthy/Faulty data for predictive maintenance AI.",
    category: "Industrial AI & Predictive Maintenance",
    publishedAt: "2026-03-26",
    readingTimeMinutes: 8,
    keywords: [
      "bearing fault detection dataset",
      "industrial thermography data",
      "predictive maintenance dataset",
      "thermal imaging AI",
      "radiometric dataset",
      "bearing failure detection",
      "machine learning industrial data",
    ],
  },
  {
    slug: "what-is-a-data-marketplace",
    title: "What Is a Data Marketplace? The $5.7B Industry Reshaping How the World Accesses Data",
    description: "Data marketplaces are a $1.49B industry growing at 25.2% CAGR. Learn how they work, who uses them, and why platforms like Kuinbee are building the future of global data access.",
    category: "Data Economy",
    publishedAt: "2026-03-20",
    readingTimeMinutes: 8,
    keywords: ["data marketplace", "buy datasets", "data economy", "data access", "alternative data", "Kuinbee"],
  },
  {
    slug: "where-to-buy-reliable-datasets-2026",
    title: "Where to Buy Reliable Datasets in 2026: The Complete Buyer's Guide",
    description: "Poor data quality costs organizations $12.9M/year (Gartner). Here's exactly where to find reliable datasets in 2026—free sources, paid platforms, and marketplaces like Kuinbee.",
    category: "Data Buyer's Guide",
    publishedAt: "2026-03-20",
    readingTimeMinutes: 9,
    keywords: ["buy datasets", "reliable data", "data quality", "data marketplace 2026", "dataset sources", "Kuinbee"],
  },
  {
    slug: "how-businesses-use-data-2026",
    title: "How Businesses Use Data to Make Better Decisions in 2026",
    description: "Data-driven companies are 23× more likely to acquire customers and 19× more likely to be profitable (McKinsey). Here's what they actually do differently—and how to close the gap.",
    category: "Strategy & Analytics",
    publishedAt: "2026-03-20",
    readingTimeMinutes: 9,
    keywords: [
      "data-driven decision making",
      "business analytics",
      "data strategy 2026",
      "data ROI",
      "external data",
      "Kuinbee",
    ],
  },
  {
    slug: "data-monetization-2026",
    title: "The Growing Economy of Data Monetization: How Organizations Turn Data Into Revenue",
    description: "The data monetization market hits $4.78B in 2025, growing 25% annually toward $28B by 2033. Learn how organizations convert data into revenue\u2014and how platforms like Kuinbee make it accessible.",
    category: "Data Economy",
    publishedAt: "2026-03-20",
    readingTimeMinutes: 9,
    keywords: [
      "data monetization",
      "sell data",
      "data economy",
      "data marketplace",
      "alternative data",
      "Kuinbee",
    ],
  },
  {
    slug: "custom-data-collection-2026",
    title: "Why Custom Data Collection Is Becoming Essential for Businesses in 2026",
    description: "60% of AI projects are abandoned due to poor-quality data (Gartner). Custom data collection solves what public datasets can't\u2014here's how it works and how platforms like Kuinbee make it accessible.",
    category: "Data Strategy",
    publishedAt: "2026-03-20",
    readingTimeMinutes: 9,
    keywords: [
      "custom data collection",
      "data collection methods",
      "AI training data",
      "primary data collection",
      "data strategy 2026",
      "Kuinbee",
    ],
  },
  {
    slug: "agricultural-data-food-security-sustainable-growth",
    title: "Agricultural Data & Food Security: Leveraging Data for Sustainable Growth",
    description: "Feeding 10 billion people by 2050 is not a farming challenge \u2014 it is a data challenge. How structured agricultural datasets are closing the gap between supply and hunger.",
    category: "Agriculture & Food Security",
    publishedAt: "2026-03-21",
    readingTimeMinutes: 9,
    keywords: ["agriculture data", "crop yield data", "food security datasets", "agri analytics", "farming data India", "soil health monitoring", "agricultural data platform"],
  },
  {
    slug: "global-economic-data-trends-2026",
    title: "Global Economic Data Trends 2026: Insights, Forecasting & Data-Driven Decisions",
    description: "Explore global economic data trends, GDP insights, inflation patterns, and AI-powered forecasting models using structured macroeconomic datasets.",
    category: "Finance",
    publishedAt: "2026-03-21",
    readingTimeMinutes: 9,
    keywords: [
      "economic data",
      "global GDP trends",
      "inflation data",
      "economic forecasting",
      "macroeconomic datasets",
      "economic indicators",
    ],
  },
  {
    slug: "energy-data-analytics-renewable-consumption",
    title: "Energy Data Analytics 2026: Renewable Energy & Consumption Insights",
    description: "Explore energy datasets, renewable energy analytics, and electricity consumption trends using Kuinbee's data marketplace.",
    category: "Energy & Sustainability",
    publishedAt: "2026-03-21",
    readingTimeMinutes: 9,
    keywords: [
      "energy data",
      "renewable energy datasets",
      "electricity consumption data",
      "energy analytics",
      "power sector data",
      "smart grid data",
      "energy forecasting",
    ],
  },
  {
    slug: "financial-data-analytics-market-intelligence",
    title: "Financial Data Analytics: Unlocking Market Intelligence with Real-Time Data",
    description: "Discover how financial datasets, stock market analytics, and real-time fintech data platforms are transforming investment decisions in 2026.",
    category: "Finance & Fintech",
    publishedAt: "2026-03-21",
    readingTimeMinutes: 9,
    keywords: ["financial data analytics", "stock market data", "fintech datasets", "real-time financial data", "investment data", "algorithmic trading data", "alternative datasets"],
  },
  {
    slug: "what-is-kdts-kuinbee-data-trust-score",
    title: "What is KDTS (Kuinbee Data Trust Score)? The Future of Data Credibility",
    description: "Learn how KDTS ensures dataset quality, legality, and usability through a transparent five-dimension trust framework.",
    category: "Data Economy",
    publishedAt: "2026-03-21",
    readingTimeMinutes: 8,
    keywords: [
      "KDTS",
      "Kuinbee Data Trust Score",
      "data quality score",
      "dataset credibility",
      "data reliability metrics",
      "data compliance",
      "data provenance",
    ],
  },
  {
    slug: "state-wise-public-sector-employment-india",
    title: "State-Wise Public Sector Employment Data in India: Trends, Insights & Dataset",
    description: "Explore state-wise public sector employment trends in India using a structured, KDTS-verified dataset for policy and labor analysis.",
    category: "India Labor & Employment Data",
    publishedAt: "2026-03-21",
    readingTimeMinutes: 8,
    keywords: [
      "state wise employment India",
      "public sector employment data India",
      "government workforce dataset India",
      "labor statistics India dataset",
      "employment trends India states",
    ],
  },
  {
    slug: "environmental-data-climate-insights-sustainability",
    title: "Environmental Data & Climate Insights 2026: Using Data to Drive Sustainability",
    description: "Discover climate data, environmental datasets, and sustainability analytics for AQI, carbon, water, and ESG workflows.",
    category: "Environment & Sustainability",
    publishedAt: "2026-03-21",
    readingTimeMinutes: 9,
    keywords: [
      "environmental data",
      "climate datasets",
      "pollution data",
      "sustainability analytics",
      "climate change data",
      "AQI data",
      "carbon emissions dataset",
      "ESG data",
    ],
  },
];
