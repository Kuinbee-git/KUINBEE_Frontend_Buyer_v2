/**
 * SEO Best Practices & Implementation Guide
 * 
 * This document outlines SEO improvements for the Kuinbee Marketplace during development.
 */

# SEO Implementation Checklist

## ✅ Completed

### 1. Technical SEO Foundation
- [x] Metadata configuration with Open Graph and Twitter Cards
- [x] Structured data (JSON-LD) utilities for datasets, reviews, breadcrumbs
- [x] Dynamic sitemap generation (`/sitemap.xml`)
- [x] Robots.txt configuration (`/robots.txt`)
- [x] PWA manifest.json
- [x] Canonical URLs
- [x] Meta descriptions with optimal length (155 chars)
- [x] Page titles with optimal length (60 chars)

### 2. Performance Optimization
- [x] Font optimization with `display: swap`
- [x] Next.js App Router (automatic code splitting)
- [x] React Query caching strategy

## 🚀 To Implement During Development

### 3. Content Optimization

**Dataset Pages:**
```tsx
// Example: src/app/datasets/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const dataset = await fetchDataset(params.id);
  
  return generateMetadata({
    title: dataset.title,
    description: generateMetaDescription(dataset.description, 155),
    keywords: [dataset.category, 'dataset', ...dataset.tags],
  });
}

// Add JSON-LD structured data
<JsonLd data={generateDatasetSchema(dataset)} />
<JsonLd data={generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Datasets', url: '/datasets' },
  { name: dataset.title, url: `/datasets/${dataset.id}` }
])} />
```

**Category Pages:**
```tsx
// Implement H1-H6 hierarchy
<h1>Browse {category.name} Datasets</h1>
<h2>Popular {category.name} Datasets</h2>

// Add category-specific meta
export async function generateMetadata({ params }): Promise<Metadata> {
  return generateMetadata({
    title: `${category.name} Datasets`,
    description: `Explore premium ${category.name} datasets...`,
  });
}
```

### 4. Image Optimization

**Use Next.js Image Component:**
```tsx
import Image from "next/image";

<Image
  src={dataset.image}
  alt={`${dataset.title} - Dataset thumbnail`}
  width={800}
  height={600}
  priority={isFeatured}
  loading={isFeatured ? "eager" : "lazy"}
/>
```

**Image Best Practices:**
- Use descriptive alt text with keywords
- Implement lazy loading for below-fold images
- Use WebP format with fallbacks
- Add width/height to prevent layout shift
- Compress images (use next/image automatic optimization)

### 5. URL Structure

**SEO-friendly URLs:**
```
✅ Good: /datasets/premium-customer-sentiment-analysis
✅ Good: /categories/machine-learning
✅ Good: /datasets/123-customer-data

❌ Bad: /ds/123
❌ Bad: /view?id=123&type=dataset
```

**Implementation:**
```tsx
// Use dataset slug in URLs
const slug = dataset.title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

// Route: /datasets/[slug]
```

### 6. Internal Linking Strategy

**Add Related Datasets:**
```tsx
<section>
  <h2>Related Datasets</h2>
  <ul>
    {relatedDatasets.map(ds => (
      <li key={ds.id}>
        <Link href={`/datasets/${ds.slug}`}>
          {ds.title}
        </Link>
      </li>
    ))}
  </ul>
</section>
```

**Breadcrumbs Navigation:**
```tsx
<nav aria-label="breadcrumb">
  <ol itemScope itemType="https://schema.org/BreadcrumbList">
    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
      <Link href="/" itemProp="item">
        <span itemProp="name">Home</span>
      </Link>
      <meta itemProp="position" content="1" />
    </li>
    {/* ... more breadcrumbs */}
  </ol>
</nav>
```

### 7. Loading & Error States

**Implement Loading UI:**
```tsx
// src/app/datasets/loading.tsx
export default function Loading() {
  return <DatasetsSkeleton />;
}
```

**404 & Error Pages:**
```tsx
// src/app/not-found.tsx
export const metadata = generateMetadata({
  title: '404 - Page Not Found',
  noIndex: true,
});
```

### 8. Pagination SEO

**Implement rel="next" and rel="prev":**
```tsx
export async function generateMetadata({ searchParams }): Promise<Metadata> {
  const page = parseInt(searchParams.page || '1');
  const baseUrl = siteConfig.url;
  
  return {
    ...generateMetadata({ title: 'Datasets' }),
    alternates: {
      canonical: `${baseUrl}/datasets?page=${page}`,
      ...(page > 1 && {
        prev: `${baseUrl}/datasets?page=${page - 1}`,
      }),
      ...(hasMorePages && {
        next: `${baseUrl}/datasets?page=${page + 1}`,
      }),
    },
  };
}
```

### 9. Schema.org Markup

**Product Schema for Paid Datasets:**
```tsx
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: dataset.title,
  description: dataset.description,
  image: dataset.image,
  offers: {
    "@type": "Offer",
    price: dataset.price,
    priceCurrency: dataset.currency,
    availability: "https://schema.org/InStock",
  },
  aggregateRating: dataset.reviewCount > 0 ? {
    "@type": "AggregateRating",
    ratingValue: dataset.averageRating,
    reviewCount: dataset.reviewCount,
  } : undefined,
};

<JsonLd data={productSchema} />
```

### 10. Performance Monitoring

**Core Web Vitals to Track:**
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

**Tools:**
```bash
# Lighthouse CI
npm install -g @lhci/cli

# Run audit
lhci autorun --collect.url=http://localhost:3000
```

### 11. Accessibility = SEO

**Semantic HTML:**
```tsx
<article> {/* Dataset card */}
  <header>
    <h2>{dataset.title}</h2>
  </header>
  <section>
    <p>{dataset.description}</p>
  </section>
  <footer>
    <span aria-label="Price">{formatPrice(dataset.price)}</span>
  </footer>
</article>
```

**ARIA Labels:**
```tsx
<nav aria-label="Main navigation">
  <button aria-label="Toggle menu" aria-expanded={isOpen}>
    Menu
  </button>
</nav>
```

### 12. Dynamic Sitemap Generation

**Update sitemap with actual data:**
```tsx
// src/app/sitemap.ts
import { marketplaceService } from '@/services';

export default async function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  // Fetch all datasets
  const datasets = await marketplaceService.listDatasets({ pageSize: 1000 });
  
  const datasetUrls = datasets.items.map(ds => ({
    url: `${baseUrl}/datasets/${ds.slug}`,
    lastModified: new Date(ds.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  
  return [...staticPages, ...datasetUrls];
}
```

### 13. Social Media Preview

**Test with:**
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### 14. Google Search Console Setup

**After deployment:**
1. Verify site ownership
2. Submit sitemap
3. Monitor crawl errors
4. Check mobile usability
5. Review page experience insights

### 15. Content Strategy

**Create SEO-friendly content:**
- Dataset descriptions: 150-300 words
- Category descriptions: 200-500 words
- Blog posts about datasets: 1000+ words
- FAQ sections for common queries
- Use target keywords naturally

**Long-tail keywords to target:**
- "free machine learning datasets"
- "customer sentiment analysis data"
- "premium training data for AI"
- "buy dataset for [specific use case]"

## Environment Variables to Add

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://marketplace.kuinbee.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Tools to Integrate

- **Google Analytics 4** - Traffic & behavior tracking
- **Google Search Console** - Search performance
- **Vercel Analytics** - Web vitals monitoring
- **Sentry** - Error tracking (affects SEO if users encounter errors)

## Quick Wins Checklist

- [ ] Add unique meta descriptions to all pages
- [ ] Implement breadcrumb navigation
- [ ] Add structured data to dataset pages
- [ ] Optimize images with next/image
- [ ] Create descriptive URLs with slugs
- [ ] Add internal links between related datasets
- [ ] Implement pagination properly
- [ ] Create 404 and error pages
- [ ] Add loading states (reduces bounce rate)
- [ ] Test mobile responsiveness
- [ ] Validate HTML markup
- [ ] Check page load speed
- [ ] Add social media meta tags
- [ ] Create sitemap with all pages
- [ ] Submit sitemap to Google

## Resources

- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Dataset](https://schema.org/Dataset)
- [Web.dev Performance](https://web.dev/performance/)
