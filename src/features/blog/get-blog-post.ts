import type { BlogPost } from "./blog-posts";

/**
 * Dynamically import a single blog post by slug.
 * Only the requested post's content is loaded — no other post data
 * is included in the page's JavaScript bundle.
 */
export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  try {
    const mod = await import(`./posts/${slug}`);
    return mod.default;
  } catch {
    return undefined;
  }
}
