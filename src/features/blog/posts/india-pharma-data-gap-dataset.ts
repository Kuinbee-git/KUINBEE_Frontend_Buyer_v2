import type { BlogPost } from "../blog-posts";

const post: BlogPost = {
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
  content: [
    {
      type: "stat-row",
      items: [
        { num: "253,973", label: "medicine records with national coverage" },
        { num: "89.4", label: "KDTS score (out of 100)" },
        { num: "Free", label: "CC BY 4.0 license" },
        { num: "May 2026", label: "last assessed and updated" },
      ],
    },
    {
      type: "paragraph",
      text: "India is the world's pharmacy. It supplies over 60% of global vaccines and a third of all generic medicines. Yet structured, analytics-ready data about what is actually sold in the Indian market has been hard to access at scale. That is starting to change.",
    },
    {
      type: "paragraph",
      text: "The A-Z Medicines Dataset of India, available on Kuinbee's marketplace, is a structured reference covering 253,973 pharmaceutical products marketed in India. It spans drug names, brand identities, generic compositions, dosage forms, manufacturer information, and pricing - cleaned, standardized, and ready for analytics.",
    },
    {
      type: "tldr",
      items: [
        "India manufactures for the world, but its **pharma data has been fragmented** across regulators, circulars, and filings.",
        "The A-Z Medicines Dataset provides a **single clean table of 253,973 products** with eight core attributes.",
        "The dataset is **free under CC BY 4.0** with a KDTS quality score of **89.4**.",
        "Pricing and composition fields enable **market analysis, ML pricing models, and supply chain risk studies**.",
        "The largest limitation is freshness: **pricing snapshots need periodic refreshes** as DPCO revisions change MRPs.",
      ],
    },

    { type: "heading2", text: "Why India's Pharma Data Has Been a Blind Spot" },
    {
      type: "paragraph",
      text: "India's pharmaceutical industry generated roughly $50B in revenue in 2025 and is projected to reach $130B by 2030. It exports to 200+ countries and supports more than 10,500 registered manufacturers. The scale is extraordinary.",
    },
    {
      type: "paragraph",
      text: "Yet public drug databases are fragmented across CDSCO, state authorities, and formularies. Pricing data sits in government circulars, and composition details are scattered across labeling filings. Analysts have had to stitch inconsistent sources together or rely on expensive proprietary databases.",
    },
    {
      type: "pull-quote",
      text: "India manufactures for the world, but the data about what it manufactures has lived in silos. A consolidated, analytics-ready dataset changes the unit economics of pharmaceutical research entirely.",
    },

    { type: "heading2", text: "What's Inside: 253,973 Records, 8 Attributes" },
    {
      type: "paragraph",
      text: "The dataset is a single flat table covering the core attributes needed for pharmaceutical analytics. This schema makes it practical for SQL, Python, and BI workflows without complex joins.",
    },
    {
      type: "source-table",
      caption: "A-Z Medicines Dataset schema (core fields).",
      headers: ["Field", "Type", "Required", "Description"],
      rows: [
        {
          cells: [
            "Medicine_Name",
            "string",
            "Required",
            "Full product name as marketed in India",
          ],
        },
        {
          cells: [
            "Brand_Name",
            "string",
            "Optional",
            "Brand identity; may differ from medicine name for generics",
          ],
        },
        {
          cells: [
            "Composition",
            "string",
            "Optional",
            "Generic active ingredient(s) with strength ratios",
          ],
        },
        {
          cells: [
            "Dosage_Form",
            "categorical",
            "Optional",
            "Tablet, capsule, syrup, injection, cream, and more",
          ],
        },
        {
          cells: [
            "Strength",
            "string",
            "Optional",
            "Concentration per unit, such as 500mg or 10mg/5ml",
          ],
        },
        {
          cells: [
            "Manufacturer",
            "string",
            "Optional",
            "Normalized manufacturer name",
          ],
        },
        {
          cells: [
            "Price",
            "float",
            "Optional",
            "MRP in INR, range validated",
          ],
        },
        {
          cells: [
            "Pack_Size",
            "string",
            "Optional",
            "Units per pack, such as 10 tablets or 100ml",
          ],
        },
      ],
    },

    { type: "heading2", text: "Six High-Value Use Cases" },
    {
      type: "user-grid",
      items: [
        {
          icon: "01",
          title: "Pharmaceutical pricing analysis",
          body: "Benchmark prices by manufacturer, dosage form, and pack size. Identify under- and over-priced segments by molecule class.",
        },
        {
          icon: "02",
          title: "Competitive benchmarking",
          body: "Analyze manufacturer presence across therapeutic categories and map brand versus generic positioning.",
        },
        {
          icon: "03",
          title: "ML price prediction",
          body: "Train regression models to predict pricing from composition, manufacturer, and dosage form features.",
        },
        {
          icon: "04",
          title: "Drug category classification",
          body: "Cluster medicines by composition similarity and build molecule-to-brand mapping tools at scale.",
        },
        {
          icon: "05",
          title: "Supply chain modeling",
          body: "Quantify manufacturer concentration by category and simulate procurement risks.",
        },
        {
          icon: "06",
          title: "Healthcare cost research",
          body: "Study affordability, branded vs generic price gaps, and essential medicine baskets.",
        },
      ],
    },

    {
      type: "bar-chart",
      title: "Indicative Distribution of Medicines by Dosage Form",
      caption: "Illustrative distribution based on India pharma market structure. Tablets and capsules dominate formulations.",
      bars: [
        { label: "Tablets", value: 42, displayValue: "42%" },
        { label: "Capsules", value: 24, displayValue: "24%" },
        { label: "Syrups", value: 12, displayValue: "12%" },
        { label: "Injectables", value: 8, displayValue: "8%" },
        { label: "Topical", value: 6, displayValue: "6%" },
        { label: "Drops", value: 3, displayValue: "3%" },
        { label: "Respiratory", value: 3, displayValue: "3%" },
        { label: "Other", value: 2, displayValue: "2%" },
      ],
    },

    { type: "heading2", text: "Data Quality: What Was Done to Get It Here" },
    {
      type: "paragraph",
      text: "Raw pharmaceutical data is messy. Manufacturer names appear in multiple spellings, compositions are inconsistently recorded, and pricing can include outliers. The cleaning pipeline applied schema normalization, duplicate removal, missing value assessment, categorical standardization, and range validation on price.",
    },
    {
      type: "citation",
      text: "KDTS score: 89.4. Completeness 95, Legitimacy 92, Precision 84, Usefulness 94, Freshness 70. The freshness score reflects the reality that pricing snapshots need periodic refreshes as DPCO revisions change MRPs.",
      source: "Kuinbee data quality pipeline assessment, May 23, 2026",
    },

    { type: "heading2", text: "Honest Limitations Worth Knowing" },
    {
      type: "bullet-list",
      items: [
        "Community-sourced; not an official CDSCO registry.",
        "Pricing is a snapshot at time of compilation and not real-time.",
        "No clinical trial, prescription, or approval timeline fields.",
        "Intended for analytics and research, not prescribing decisions.",
        "Optional fields such as Brand_Name and Composition may be null in some records.",
      ],
    },

    { type: "heading2", text: "The Bigger Opportunity This Dataset Unlocks" },
    {
      type: "paragraph",
      text: "India's domestic formulations market is growing at roughly 10 to 12% annually. Generic exports are accelerating, and the government's PLI scheme is reshaping manufacturing geography. Digital health infrastructure is expanding rapidly, creating demand for pharma intelligence tools that did not exist five years ago.",
    },
    {
      type: "bar-chart",
      title: "Indicative Manufacturer Portfolio Concentration",
      caption: "India has 10,500+ registered manufacturers, but the top groups represent a disproportionate share of named products in commercial datasets.",
      bars: [
        { label: "Sun Pharma", value: 8.2, displayValue: "8.2%" },
        { label: "Cipla", value: 6.8, displayValue: "6.8%" },
        { label: "Dr. Reddy's", value: 5.9, displayValue: "5.9%" },
        { label: "Lupin", value: 5.4, displayValue: "5.4%" },
        { label: "Alkem", value: 4.8, displayValue: "4.8%" },
        { label: "Abbott India", value: 4.2, displayValue: "4.2%" },
        { label: "Mankind Pharma", value: 3.9, displayValue: "3.9%" },
        { label: "Torrent", value: 3.5, displayValue: "3.5%" },
        { label: "Zydus", value: 3.1, displayValue: "3.1%" },
        { label: "Others", value: 54.2, displayValue: "54.2%" },
      ],
    },

    {
      type: "cta",
      heading: "Explore the A-Z Medicines Dataset",
      body: "Access structured pharma datasets covering pricing, composition, dosage, and manufacturer intelligence for India's drug market.",
      buttonText: "Explore Healthcare Datasets",
      href: "/datasets",
    },
  ],
};

export default post;
