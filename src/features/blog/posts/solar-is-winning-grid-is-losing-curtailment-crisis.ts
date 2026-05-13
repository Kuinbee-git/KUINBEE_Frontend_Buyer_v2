import type { BlogPost } from "../blog-posts";

const post: BlogPost = {
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
  content: [
    {
      type: "stat-row",
      items: [
        { num: "511 GW", label: "new solar installed globally in 2025" },
        { num: "8 TWh", label: "clean energy wasted by Australia in 2025" },
        { num: "62%", label: "surge in AU curtailment year over year" },
      ],
    },
    {
      type: "stat-row",
      items: [
        { num: "100 GW", label: "first year global storage exceeded this mark" },
        { num: "3.4M MWh", label: "curtailed in California in 2024" },
        { num: "1,389 GWh", label: "solar curtailed in Germany in 2024" },
      ],
    },
    {
      type: "paragraph",
      text: "In 2018, the entire global installed solar capacity was roughly 500 gigawatts. In 2025, the world installed that much in a single year. Cumulative capacity now sits at approximately 2.4 terawatts and likely crossed 3 TW in early 2026 (Heberer, 2026). Solar accounted for 75% of all new renewable capacity added worldwide last year. By any measure, this is the fastest deployment of any energy technology in human history.",
    },
    {
      type: "paragraph",
      text: "And yet across Australia, California, Germany, and Spain, an increasingly visible problem is building: solar panels are generating electricity that grids cannot absorb, storage systems cannot capture, and operators have no choice but to simply switch off. The technical term is curtailment. The practical meaning is wasted clean energy, capacity that was built, funded, and connected, producing electricity that goes nowhere.",
    },
    {
      type: "paragraph",
      text: "Understanding why this is happening, where it is most acute, and what the realistic responses are matters enormously for investors, developers, and policymakers building the next wave of solar capacity.",
    },
    {
      type: "tldr",
      items: [
        "The world installed **511 GW of new solar capacity in 2025** - more than the entire global installed base as recently as 2018 (IRENA, 2026). Cumulative capacity reached about 2.4 TW.",
        "Australian curtailment surged **62% in 2025**, passing 6 TWh annually. Some Victorian and South Australian projects face curtailment risks of **35 to 65% by 2027** (AEMO, 2025).",
        "California curtailed **3.4 million MWh** of utility-scale solar and wind in 2024 - a 29% increase year over year (CAISO, 2025). Germany's solar curtailment **nearly doubled** to 1,389 GWh in 2024 (Bundesnetzagentur, 2025).",
        "Global energy storage crossed **100 GW of annual installations** for the first time in 2025 (Wood Mackenzie, 2026), but storage is still not keeping pace with solar deployment.",
        "Intentional overbuilding with accepted curtailment is **often cheaper than full storage coverage**, but explaining that to households and investors is still a major challenge.",
      ],
    },

    { type: "heading2", text: "The Scale of the Problem: Numbers That Should Give Us Pause" },
    {
      type: "paragraph",
      text: "The curtailment numbers are striking in their own right. But they become more significant when placed against the solar deployment backdrop that produced them.",
    },
    {
      type: "paragraph",
      text: "In 2025 alone, Australia curtailed more than 6 TWh of solar and wind generation - roughly equivalent to Tasmania's annual electricity consumption (Eldridge, 2025). Solar projects in Victoria and South Australia now face curtailment risks of 35 to 65% by 2027, according to AEMO. The operator projects that curtailment could reach 20% of potential generation as renewables push toward 80 to 90% grid share (AEMO, 2022).",
    },
    {
      type: "paragraph",
      text: "In California, 3.4 million MWh of utility-scale solar and wind output was curtailed in 2024, a 29% increase on the previous year (CAISO, 2025). In Germany, solar curtailment nearly doubled in 2024, reaching 1,389 GWh (Bundesnetzagentur, 2025). Across Europe, some regions now experience more than 500 hours of negative electricity prices per year - a market signal that generation is routinely exceeding demand (Wood Mackenzie, 2026).",
    },
    {
      type: "bar-chart",
      title: "Solar and Wind Curtailment by Market (Most Recent Year)",
      caption: "Sources: Eldridge/RenewEconomy (2025); CAISO Annual Report (2025); Bundesnetzagentur (2025); Wood Mackenzie (2026)",
      bars: [
        { label: "Australia", value: 6000, displayValue: "6,000+ GWh" },
        { label: "California", value: 3400, displayValue: "3,400 GWh" },
        { label: "Germany", value: 1389, displayValue: "1,389 GWh" },
        { label: "Europe", value: 500, displayValue: "500+ hrs" },
      ],
    },
    {
      type: "paragraph",
      text: "These numbers share a structure: curtailment rises fastest in the markets that were earliest to deploy solar at scale. Australia leads because it has the world's highest rooftop solar penetration. California leads among US states because it built utility-scale solar faster than it upgraded transmission and storage. Germany's acceleration reflects a rapid wind and solar buildout on a grid designed around baseload nuclear and coal.",
    },
    {
      type: "citation",
      text: "The solar industry installed 511 GW of new capacity in 2025, with China alone adding 378 GW - more than twice the rest of the world combined. Module prices fell to about $0.10 per watt in 2024, a 45% year over year decline driven by Chinese manufacturing overcapacity. Chinese factories produced about 630 GW of modules in 2024, creating a global stockpile exceeding 150 GW. The economics of solar have solved themselves. The economics of integrating solar have not.",
      source: "IRENA Renewable Capacity Statistics 2026; REN21 Global Status Report 2025; Ember Global Solar Tracker 2025",
    },

    { type: "heading2", text: "Why Curtailment Happens: The Midday Problem" },
    {
      type: "paragraph",
      text: "The mechanics of solar curtailment are straightforward. Solar generation peaks at midday. Electricity demand peaks in the evening. The gap between when solar produces maximum output and when people actually use electricity is the core integration challenge, and no amount of additional solar capacity alone can solve it.",
    },
    {
      type: "paragraph",
      text: "When solar generation exceeds real-time demand and available transmission capacity, grid operators face a binary choice: pay generators to switch off (curtailment) or allow grid frequency to destabilize. Curtailment is the safer one. The result is clean energy that was generated, measured, and then discarded, capacity that exists on paper but contributes nothing to actual consumption.",
    },
    {
      type: "paragraph",
      text: "The economic logic that produced this situation is rational, if counterintuitive. In many markets, overbuilding solar capacity and accepting significant curtailment is still cheaper than building enough storage to capture every watt of generation. Australia's system operator acknowledges this openly in its Integrated System Plan (AEMO, 2022).",
    },
    {
      type: "pull-quote",
      text: "Overbuilding solar capacity and accepting significant curtailment is, in many markets, still cheaper than building enough storage to capture every watt. This is rational system planning. It is also a difficult message to communicate to a homeowner who spent thousands on panels and is being told to switch off at midday.",
    },
    {
      type: "insight",
      text: "The curtailment problem contains a feedback loop. When curtailment reduces solar revenue, project economics weaken, signaling to developers that solar-only projects are increasingly marginal. That pushes developers toward hybrid solar plus storage designs with better economics in high-curtailment markets. But hybrids require more capital, more complex permitting, and longer timelines. The market is correcting, but the correction takes years while curtailment continues.",
    },

    { type: "heading2", text: "The Storage Response: Real Progress, Not Enough" },
    {
      type: "paragraph",
      text: "The storage industry is responding. The global energy storage market crossed 100 GW of annual installations for the first time in 2025. Europe saw storage installations grow by 160% year over year. Germany added 6.57 GWh of battery capacity in 2025, bringing its total to roughly 24 GWh. In Australia, the Clean Energy Regulator projects up to 520,000 residential battery installations in 2026, delivering up to 12 GWh of new household storage.",
    },
    {
      type: "paragraph",
      text: "These are real achievements. They are also not yet sufficient to close the gap between solar generation and grid absorption capacity. Several structural features of the storage problem make it harder than it looks.",
    },
    {
      type: "paragraph",
      text: "Storage capacity is not the same as storage duration. A market that needs to shift midday solar generation to evening peak demand requires not just megawatts of storage capacity but hours of discharge duration. Four-hour battery systems can absorb and return one cycle per day. Seasonal storage requires different technology at different cost points.",
    },
    {
      type: "paragraph",
      text: "The practical response the market has found is the hybrid project: solar paired with co-located storage from the design stage, with revenue structures that account for both generation and storage value. But this transition changes the consumer proposition in a way that matters for adoption: the simple 'solar saves money' story becomes 'solar plus storage might save money, depending on your tariff structure, export rate, and local grid conditions.'",
    },
    {
      type: "bar-chart",
      title: "Global Solar Installations Continue to Outpace Storage (2021-2025)",
      caption: "Sources: IRENA (2026); Wood Mackenzie (2026); Ember (2026). Storage installations rose to 100 GW in 2025, still well below solar additions.",
      bars: [
        { label: "2021", value: 170, displayValue: "170 GW" },
        { label: "2022", value: 230, displayValue: "230 GW" },
        { label: "2023", value: 350, displayValue: "350 GW" },
        { label: "2024", value: 450, displayValue: "450 GW" },
        { label: "2025", value: 511, displayValue: "511 GW" },
      ],
    },

    { type: "heading2", text: "Five Markets, Five Responses to the Same Problem" },
    {
      type: "paragraph",
      text: "The curtailment and storage gap is a global phenomenon. The policy response to it is not. Each major market is telling itself a different story about the same underlying problem, and those stories guide infrastructure investment decisions that will persist for decades.",
    },
    {
      type: "user-grid",
      items: [
        {
          icon: "🇺🇸",
          title: "United States - Policy Retreat",
          body: "The One Big Beautiful Bill Act (July 2025) terminated the residential solar tax credit for systems installed after December 2025. Commercial and utility projects face compressed deadlines. Battery storage was treated more favorably, an acknowledgement that storage is the binding constraint.",
        },
        {
          icon: "🇨🇳",
          title: "China - Managed Correction",
          body: "Installed 378 GW in 2025, more than twice the rest of the world. Now managing consequences: CPIA forecasts additions falling to 180 to 240 GW in 2026. The government removed the mandate to pair storage with new renewables, shifting to market mechanisms.",
        },
        {
          icon: "🇦🇺",
          title: "Australia - Active Adaptation",
          body: "Furthest along the adoption curve and the most visible curtailment challenge. The Cheaper Home Batteries Scheme drove 193,000 residential battery installations in 2025. New tariff structures discourage midday export, and VPP trials aggregate home batteries as grid resources.",
        },
        {
          icon: "🇩🇪",
          title: "Germany - Storage Scaling",
          body: "Added 6.57 GWh of battery capacity in 2025, bringing total to about 24 GWh. Storage grew 160% in Europe year over year, but solar curtailment still nearly doubled in 2024, suggesting storage buildout is lagging generation growth.",
        },
        {
          icon: "🇮🇳",
          title: "India - Ambition plus Risk",
          body: "Added 49 GW in 2025, with 42.5 GW forecast in 2026. Grid infrastructure gaps are more acute than any other major market. Battery manufacturing incentives and solar subsidies signal policy intent, but curtailment risk could rise before storage catches up.",
        },
      ],
    },
    {
      type: "paragraph",
      text: "The Australian trajectory is particularly instructive because it previews where other markets are heading. Australia moved through confidence (high adoption), then frustration (rising curtailment, falling export rates), toward pragmatic adaptation (battery subsidies, VPPs, new tariff structures). Other markets with high solar penetration appear likely to follow the same arc, with a lag of roughly three to five years.",
    },
    {
      type: "citation",
      text: "Australia's Cheaper Home Batteries Scheme drove more than 193,000 residential battery installations in 2025, delivering 4.6 GWh of storage. By 2026, the Clean Energy Regulator projects up to 520,000 residential battery installations delivering up to 12 GWh, more than the country's twelve largest grid-scale batteries combined. In Australia and India, more than half of storage projects announced in 2025 were hybrid solar plus storage designs, reflecting the market's practical response to standalone solar economics weakening under curtailment pressure.",
      source: "Clean Energy Regulator, Small-scale Technology and Battery Forecast 2026; Wood Mackenzie Global Storage Report 2026",
    },

    { type: "heading2", text: "The Iran Variable: Energy Security Changes the Calculation" },
    {
      type: "paragraph",
      text: "The curtailment story was already developing momentum before the Strait of Hormuz closed in March 2026. The Hormuz closure, which the IEA characterized as the largest supply disruption in the history of the global oil market, has accelerated every dynamic in this report simultaneously (IEA, 2026).",
    },
    {
      type: "paragraph",
      text: "Brent crude surged past $120 per barrel. European gas prices nearly doubled, with Dutch TTF benchmarks exceeding 60 EUR per MWh. Energy bills are rising again across every major economy. The payback period for solar plus storage has compressed sharply. Australia's Clean Energy Regulator projects up to 520,000 residential battery installations in 2026 partly as a direct response to this urgency (CER, 2026).",
    },
    {
      type: "paragraph",
      text: "For the storage-solar gap specifically, the Hormuz crisis is doing two things that cut in the same direction. It strengthens the energy security case for solar, domestically produced electricity that requires no shipping routes or foreign fuel supply. And it sharpens the household economics case, as higher energy bills shorten payback periods and increase the urgency to act.",
    },
    {
      type: "paragraph",
      text: "The energy security frame also changes the political valence of storage investment. Storage is no longer just a grid optimization tool. It is insurance against supply disruption. That reframing could unlock policy support and public acceptance for grid modernization investments that struggled to gain traction when oil prices were low.",
    },
    {
      type: "insight",
      text: "The Hormuz crisis is compressing the timeline on a transition that was already underway, but it is also compressing it unevenly. Markets with strong grid infrastructure and policy frameworks will accelerate faster. Markets where storage investment already lagged behind solar deployment face a harder dynamic: rising solar urgency pulls deployment forward while the grid infrastructure gap that produces curtailment remains unresolved.",
    },

    { type: "heading2", text: "What Needs to Happen: The Integration Agenda" },
    {
      type: "paragraph",
      text: "The curtailment problem is solvable. The engineering responses exist or are actively emerging. The barriers are primarily economic, regulatory, and political, not technical. Four interventions have the clearest evidence base.",
    },
    {
      type: "bullet-list",
      items: [
        "**Hybrid project mandates and incentives.** Solar plus storage hybrids perform significantly better economically in high-curtailment markets. Policy frameworks that incentivize or require co-located storage shift developer economics without waiting for standalone storage to become cheap enough to deploy independently.",
        "**Time-of-use tariff reform.** Household solar economics are distorted by flat export rates that do not reflect the declining value of midday surplus. Tariff structures that price midday exports lower and evening consumption higher incentivize storage adoption and load shifting.",
        "**Virtual power plant frameworks.** Aggregating home batteries into dispatchable grid resources transforms distributed storage from a private household investment into a grid asset. Regulatory frameworks to enable this broadly do not yet exist in most markets.",
        "**Transmission investment aligned with generation.** Much curtailment is caused by transmission constraints, not storage shortages. Permitting and construction timelines remain far slower than solar deployment. Closing this gap requires regulatory reform as much as capital investment.",
      ],
    },

    { type: "heading2", text: "Frequently Asked Questions" },
    {
      type: "faq",
      items: [
        {
          q: "What does solar curtailment actually mean and why does it happen?",
          a: "Curtailment means switching off solar or wind generation that the grid cannot absorb at a given moment, most commonly because generation exceeds real-time demand, transmission lines are congested, or the grid lacks stability mechanisms. The core cause is the timing mismatch between peak solar generation (midday) and peak electricity demand (evening).",
        },
        {
          q: "Is building more storage the solution to curtailment?",
          a: "Storage is the primary technical response, but it is not the only one and not always the cheapest. In markets with very low solar module costs, intentional overbuilding with accepted curtailment is often cheaper than building enough storage to capture every watt. Hybrid projects, tariff reform, VPPs, and transmission upgrades all contribute.",
        },
        {
          q: "How does the 2026 Iran-Hormuz crisis affect the solar storage gap?",
          a: "The crisis strengthens the case for solar on energy security grounds, shortens household payback periods by raising energy bills, and creates political urgency for domestic energy investment. It accelerates battery adoption, but it does not resolve the structural grid infrastructure challenges that produce curtailment.",
        },
        {
          q: "Why has China started slowing its solar deployment in 2026?",
          a: "China installed 378 GW of solar in 2025, more than twice the rest of the world combined, but is now managing domestic overcapacity and economic consequences. CPIA forecasts additions falling to 180 to 240 GW in 2026 as policy shifts from mandate-driven buildout to market mechanisms.",
        },
      ],
    },

    {
      type: "cta",
      heading: "Stay Ahead of Energy Data",
      body: "Access energy market datasets, renewable generation data, and storage analytics through Kuinbee's global data marketplace.",
      buttonText: "Explore Energy Datasets",
      href: "/datasets",
    },
  ],
};

export default post;
