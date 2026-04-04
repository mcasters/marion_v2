import React, { Fragment } from "react";
import { Post } from "@/lib/type";

import { Metadata } from "next";
import { KEY_META } from "@/constants/admin.ts";
import s from "@/styles/page.module.css";
import FormattedPhoto from "@/components/image/formattedPhoto.tsx";
import Gallery from "@/components/image/gallery/gallery.tsx";
import { getPosts } from "@/app/admin/posts/action.ts";
import { getMetas } from "@/app/admin/meta/action.ts";
import { TYPE } from "@/db/schema.ts";

export async function generateMetadata(): Promise<Metadata | undefined> {
  const metas = await getMetas();
  if (metas) {
    return {
      title: metas.get(KEY_META.DOCUMENT_TITLE_POST),
      description: metas.get(KEY_META.DESCRIPTION_POST),
      openGraph: {
        title: metas.get(KEY_META.DOCUMENT_TITLE_POST),
        description: metas.get(KEY_META.DESCRIPTION_POST),
        url: metas.get(KEY_META.URL),
        siteName: metas.get(KEY_META.SEO_SITE_TITLE),
        locale: "fr",
        type: "website",
      },
    };
  }
}

export default async function Posts() {
  const posts = await getPosts();

  return (
    <>
      <h1 className="hidden">Posts</h1>
      {posts.map((post: Post) => {
        const mainImage = post.images.filter((image) => image.isMain);
        const hasImageForGallery = post.images.length > mainImage.length;
        return (
          <Fragment key={post.id}>
            <article className={s.postContainer}>
              {mainImage.length > 0 && (
                <FormattedPhoto
                  folder={TYPE.POST}
                  filename={mainImage[0].filename}
                  width={mainImage[0].width}
                  height={mainImage[0].height}
                  alt={`Photo du post "${post.title}" de ${process.env.TITLE}`}
                  priority={true}
                  displayWidth={{ small: 65, large: 30 }}
                  displayHeight={{ small: 35, large: 50 }}
                  withLightbox={true}
                />
              )}
              <div className={s.postInfo}>
                <h2>{post.title}</h2>
                <time>{new Date(post.date).getFullYear()}</time>
                <p>
                  <br />
                  {post.text}
                </p>
              </div>
              {hasImageForGallery && <Gallery items={[post]} />}
            </article>
            <span>
              <strong>***</strong>
            </span>
          </Fragment>
        );
      })}
    </>
  );
}
