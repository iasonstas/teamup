import Link from 'next/link';

export default function PostFeed({ posts, admin }) {
   return posts ? posts.map(post => <PostItem post={post} key={post?.slug} admin={admin} />) : null;
}

function PostItem({ post, admin = false }) {
   // Naive method to calc word count and read time
   const wordCount = post?.content.trim().split(/\s+/g).length;
   const minutesToRead = (wordCount / 100 + 1).toFixed(0);

   return (
      <div className="card">
         <Link href={`/${post.username}/${post.slug}`}>
            <h2>
               <a>{post.title}</a>
            </h2>
         </Link>

         <footer className="flex-col ">
            <span>
               {wordCount} words. {minutesToRead} min read written by
               <Link href={`/${post.username}`}>
                  <a className="ml-1">
                     <strong>@{post.username}</strong>
                  </a>
               </Link>
            </span>

            <div className="flex justify-between mt-2">
               <span>💗 {post.heartCount || 0} Why not?</span>
               <span>✊🏼 {post.heartCount || 0} Supporters</span>
               <span>👊🏼 {post.heartCount || 0} Opponents</span>
               <span>💸 {post.heartCount || 0} Donations</span>
            </div>
         </footer>

         {/* If admin view, show extra controls for user */}
         {admin && (
            <>
               <Link href={`/admin/${post.slug}`}>
                  <h3>
                     <button className="btn-blue">Edit</button>
                  </h3>
               </Link>

               {post.published ? (
                  <p className="text-success">Live</p>
               ) : (
                  <p className="text-danger">Unpublished</p>
               )}
            </>
         )}
      </div>
   );
}
