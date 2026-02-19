import React, { Fragment } from "react";
import { Post } from "@/lib/type";

import { getPosts } from "@/app/actions/item-post";
import { Metadata } from "next";
import { getMetaMap } from "@/lib/utils/commonUtils.ts";
import { getMetas } from "@/app/actions/meta";
import { META } from "@/constants/admin.ts";
import s from "@/styles/page.module.css";
import FormattedPhoto from "@/components/image/formattedPhoto.tsx";
import Gallery from "@/components/image/gallery/gallery.tsx";
import { getPostPhotoTab } from "@/lib/utils/imageUtils.ts";

export async function generateMetadata(): Promise<Metadata | undefined> {
  const metas = getMetaMap(await getMetas());
  if (metas) {
    return {
      title: metas.get(META.DOCUMENT_TITLE_POST),
      description: metas.get(META.DESCRIPTION_POST),
      openGraph: {
        title: metas.get(META.DOCUMENT_TITLE_POST),
        description: metas.get(META.DESCRIPTION_POST),
        url: metas.get(META.URL),
        siteName: metas.get(META.SEO_SITE_TITLE),
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
      {posts.length > 0 &&
        posts.map((post: Post) => {
          const photoTab = getPostPhotoTab(
            post,
            `Photo du post "${post.title}" de ${process.env.TITLE}`,
          );
          return (
            <Fragment key={post.id}>
              <article className={s.postContainer}>
                <>
                  <FormattedPhoto
                    photoTab={photoTab.mainPhotos}
                    priority={true}
                    width={{ small: 65, large: 30 }}
                    height={{ small: 35, large: 50 }}
                    withLightbox={true}
                  />
                </>

                <div className={s.postInfo}>
                  <h2>{post.title}</h2>
                  <time>{new Date(post.date).getFullYear()}</time>
                  <p>
                    <br />
                    {post.text}
                  </p>
                </div>
                {photoTab.photos.sm.length > 0 && (
                  <Gallery photos={photoTab.photos} />
                )}
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
