import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { POST_OG_IMAGE_ALT, POST_OG_IMAGE_CONTENT_TYPE, POST_OG_IMAGE_SIZE, renderPostOgImage } from "@/lib/post-og-image";
import { splitPostSlug } from "@/lib/utils";

export const alt = POST_OG_IMAGE_ALT;
export const size = POST_OG_IMAGE_SIZE;
export const contentType = POST_OG_IMAGE_CONTENT_TYPE;

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({
    lang: post.lang,
    slug: splitPostSlug(post.slug).slug,
  }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const post = getPostBySlug(`${lang}/${slug}`);

  if (!post) {
    throw new Error(`Post not found for OG image: ${lang}/${slug}`);
  }

  return renderPostOgImage(post);
}
