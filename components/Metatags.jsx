import Head from 'next/head';
export default function MetaTags({ title, description, image, imageAlt, url }) {
   return (
      <Head>
         <title>{title}</title>
         {/* <!--  Essential META Tags --> */}
         <meta property="og:title" content={title} />
         <meta property="og:description" content={description} />
         <meta property="og:image" content={image} />
         <meta property="og:image:alt" content={imageAlt} />
         <meta property="og:url" content={url} />
         <meta property="og:type" content="article" />
         <meta name="twitter:card" content="summary" />
         {/* <!--  Non-Essential, But Recommended --> */}
         <meta property="og:site_name" content="tzimani.gr" />
         <meta property="twitter:title" content={description} />
         <meta property="twitter:description" content={description} />
         <meta property="twitter:image" content={image} />
         <meta name="twitter:image:alt" content={imageAlt} />
         <meta property="twitter:url" content={url} />
         {/* <!--  Non-Essential, But Required for Analytics --> */}
         <meta property="fb:app_id" content="your_app_id" />
         <meta name="twitter:site" content="@tzimani.gr" />
      </Head>
   );
}
