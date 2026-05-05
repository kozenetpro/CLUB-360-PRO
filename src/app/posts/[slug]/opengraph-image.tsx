import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { POST_OG_IMAGE_ALT, POST_OG_IMAGE_CONTENT_TYPE, POST_OG_IMAGE_SIZE, renderPostOgImage } from "@/lib/post-og-image";
import { DEFAULT_POST_LANG, splitPostSlug } from "@/lib/utils";

export const alt = POST_OG_IMAGE_ALT;
export const size = POST_OG_IMAGE_SIZE;
export const contentType = POST_OG_IMAGE_CONTENT_TYPE;

export async function generateStaticParams() {
  return getAllPosts()
    .filter((post) => post.lang === DEFAULT_POST_LANG)
    .map((post) => ({ slug: splitPostSlug(post.slug).slug }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(`${DEFAULT_POST_LANG}/${slug}`);

  if (!post) {
    throw new Error(`Post not found for OG image: ${slug}`);
  }

  return renderPostOgImage(post);
}
