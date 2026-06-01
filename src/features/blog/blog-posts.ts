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
    slug: "skills-premium-salary-divide-india",
    title: "The Skills Premium Has Become India's New Salary Divide",
    description:
      "As AI, cloud, cybersecurity, and global capability centers reshape hiring, pay is now a market signal for scarcity, capability, location, and speed of adaptation.",
    category: "Workforce Intelligence",
    publishedAt: "2026-05-27",
    readingTimeMinutes: 9,
    keywords: [
      "skills premium",
      "salary divide",
      "India tech workforce",
      "GCC",
      "AI hiring",
      "cybersecurity talent",
      "salary benchmarks",
    ],
  },
  {
    slug: "india-pharma-data-gap-dataset",
    title: "India's Pharmaceutical Data Gap - and the Dataset Filling It",
    description:
      "253,973 medicines, 8 attributes, and a KDTS score of 89.4. A structured A-Z medicines dataset is closing India's pharma intelligence gap.",
    category: "Healthcare Data",
    publishedAt: "2026-05-23",
    readingTimeMinutes: 9,
    keywords: [
      "India pharma dataset",
      "medicines database",
      "drug pricing",
      "pharmaceutical analytics",
      "KDTS",
      "healthcare data",
      "generic medicines",
    ],
  },
  {
    slug: "india-corporate-revenue-landscape",
    title: "India's Corporate Revenue Landscape: How the Country's Biggest Companies Are Growing",
    description:
      "India's BS1000 revenue grew 6.4% in FY25, with market cap hitting INR 325 trillion. Here is what the revenue data of India's top companies reveals about growth, sector divergence, and the GDP gap.",
    category: "Corporate Finance",
    publishedAt: "2026-06-01",
    readingTimeMinutes: 9,
    keywords: [
      "India BS1000",
      "corporate revenue",
      "nominal GDP gap",
      "sector divergence",
      "market capitalization",
      "financial services",
      "IT services",
    ],
  },
  {
    slug: "true-economic-cost-of-war",
    title: "The True Economic Cost of War: How Conflict Destroys Livelihoods and What Recovery Looks Like",
    description:
      "War costs the global economy $19.1 trillion a year. Real GDP falls 12% over a decade. IMF 2026 data shows fiscal deficits worsen by 2.6% of GDP. Here is the full economic anatomy of conflict.",
    category: "Global Economics",
    publishedAt: "2026-06-01",
    readingTimeMinutes: 10,
    keywords: [
      "conflict economics",
      "war GDP impact",
      "IMF WEO 2026",
      "fiscal deficits",
      "reconstruction",
      "refugee economics",
      "global risks",
    ],
  },
  {
    slug: "india-ipo-market-2010-2025",
    title: "India's IPO Market 2010-2025: From Tentative Listings to the World's Busiest Exchange",
    description:
      "338 companies went public in India in 2024, raising a record $21B. NSE became the world's #1 exchange by deal count. Here is the complete story of India's IPO decade and what comes next.",
    category: "Finance",
    publishedAt: "2026-06-01",
    readingTimeMinutes: 9,
    keywords: [
      "India IPO market",
      "NSE",
      "BSE",
      "SEBI",
      "SME IPO",
      "listing gains",
      "capital markets",
      "IPO oversubscription",
    ],
  },
  {
    slug: "how-ai-is-transforming-cardiac-ultrasound-echocardiography",
    title: "How AI Is Transforming Cardiac Ultrasound: The New Era of Echocardiography",
    description:
      "AI in cardiology grows from $2.14B to $32B by 2033. Here is how machine learning is reshaping echocardiography, from automated EF measurement to point-of-care imaging in rural India.",
    category: "Healthcare AI",
    publishedAt: "2026-05-12",
    readingTimeMinutes: 12,
    keywords: [
      "echocardiography",
      "cardiac ultrasound",
      "AI in cardiology",
      "LVEF",
      "DICOM",
      "medical imaging AI",
      "India healthcare",
    ],
  },
  {
    slug: "energy-narratives-2026-solar-future",
    title: "The Stories Shaping Solar's Future Matter More Than the Data | Energy Narratives 2026",
    description:
      "Three competing narratives - technological confidence, cost anxiety, and grid-reliability fear - are shaping the solar transition more than any dataset. Here is why, and what history says happens next.",
    category: "Energy & Sustainability",
    publishedAt: "2026-04-28",
    readingTimeMinutes: 10,
    keywords: [
      "solar narratives",
      "energy transition",
      "grid reliability",
      "renewable policy",
      "energy security",
      "Hormuz crisis",
      "ENTSO-E",
    ],
  },
  {
    slug: "solar-is-winning-grid-is-losing-curtailment-crisis",
    title: "Solar Is Winning. The Grid Is Losing. | The Curtailment Crisis Explained",
    description:
      "511 GW of new solar in 2025. But Australia wasted 8 TWh, California curtailed 3.4M MWh, and Germany's solar waste nearly doubled. The grid cannot keep up. Here is what is happening.",
    category: "Energy & Sustainability",
    publishedAt: "2026-04-26",
    readingTimeMinutes: 10,
    keywords: [
      "solar curtailment",
      "grid integration",
      "energy storage",
      "renewable curtailment",
      "solar overbuild",
      "AEMO",
      "CAISO",
      "Bundesnetzagentur",
      "energy market data",
    ],
  },
  {
    slug: "why-call-center-speech-ai-is-harder-than-everyone-thinks",
    title: "Why Call Center Speech AI Is Harder Than Everyone Thinks — And What It Actually Takes to Get It Right",
    description:
      "The call center AI market hits $4.1B in 2026. But telephony audio, dialect complexity, and LLM pipelines mean most deployments are failing quietly.",
    category: "AI Infrastructure",
    publishedAt: "2026-04-25",
    readingTimeMinutes: 10,
    keywords: [
      "call center AI",
      "speech recognition",
      "ASR",
      "telephony audio",
      "conversational AI",
      "telecom AI",
      "voice AI",
    ],
  },
  {
    slug: "why-most-healthcare-call-centers-fail-at-the-moment-that-matters-most",
    title: "Why Most Healthcare Call Centers Fail at the Exact Moment That Matters Most",
    description:
      "Most healthcare call centers don’t fail on scripts or staffing—they fail at the trust moment customers never say out loud.",
    category: "Healthcare Operations",
    publishedAt: "2026-04-25",
    readingTimeMinutes: 8,
    keywords: [
      "healthcare call center",
      "medical device sales",
      "conversation friction",
      "accent comprehension",
      "customer trust",
      "healthcare AI",
      "contact center analytics",
    ],
  },
  {
    slug: "one-million-de-identified-mri-scans-radiology-reports-medical-ai",
    title: "What 1 Million De-Identified MRI Scans With Radiology Reports Actually Means for Medical AI",
    description:
      "AI medical imaging hits $2.55B in 2026 at a 34.7% CAGR. Here’s why this 1M-scan MRI dataset from India is the kind of data that moves that number.",
    category: "Healthcare AI",
    publishedAt: "2026-04-24",
    readingTimeMinutes: 10,
    keywords: [
      "medical imaging",
      "MRI dataset",
      "healthcare AI",
      "DICOM",
      "radiology AI",
      "India health data",
    ],
  },
  {
    slug: "mexican-spanish-telecom-audio-voice-ai-value",
    title: "Why Mexican Spanish Telecom Audio Is One of the Most Valuable Datasets in Voice AI",
    description:
      "Voice AI reached $22.5B in 2026, but Mexican Spanish telecom conversations remain one of the biggest ASR gaps. Here’s why this dataset category is becoming strategic.",
    category: "AI Infrastructure",
    publishedAt: "2026-04-24",
    readingTimeMinutes: 10,
    keywords: [
      "Mexican Spanish ASR",
      "telecom call center dataset",
      "voice AI training data",
      "domain-specific speech data",
      "contact center AI",
      "KDTS",
      "Kuinbee marketplace",
    ],
  },
  {
    slug: "the-real-bottleneck-in-ai-isnt-models-its-data",
    title: "The Real Bottleneck in AI Isn't Models. It's Data.",
    description: "Why the companies winning the next phase of AI won't build better architectures—they'll control better training fuel.",
    category: "AI Infrastructure",
    publishedAt: "2026-04-17",
    readingTimeMinutes: 8,
    keywords: [
      "AI training data",
      "domain-specific speech datasets",
      "conversational AI data",
      "enterprise AI procurement",
      "multilingual speech data",
      "data compliance",
      "AI infrastructure",
    ],
  },
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
