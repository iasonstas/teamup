import { firestore, fromMillis, postToJSON } from '../shared/firebase';
import Loader from 'components/Loader';
import { useState } from 'react';
import PostFeed from 'components/PostFeed';
// import { data } from '../lib/dummyData';

// Max post to query per page
const LIMIT = 5;

export async function getServerSideProps(context) {
   const postQuery = firestore
      .collectionGroup('posts') //TIP: collectionGroup grabs any subcollection no matter where is nested in the tree of documents with tha name
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(LIMIT);
   const posts = (await postQuery.get()).docs.map(postToJSON);

   return {
      props: { posts }
   };
}

export default function Home(props) {
   //  firestore.collection('users').doc('Y6UopWwnGPgMidCngd7GxRE3V9b2').collection('posts').add(data);  //add dummy data
   const [posts, setPosts] = useState(props.posts);
   const [loading, setLoading] = useState(false);

   const [postsEnd, setPostsEnd] = useState(false);

   const getMorePosts = async () => {
      setLoading(true);
      const last = posts[posts.length - 1];

      const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

      const query = firestore
         .collectionGroup('posts')
         .where('published', '==', true)
         .orderBy('createdAt', 'desc')
         .startAfter(cursor)
         .limit(LIMIT);

      const newPosts = (await query.get()).docs.map(doc => doc.data());

      setPosts(posts.concat(newPosts));
      setLoading(false);

      if (newPosts.length < LIMIT) {
         setPostsEnd(true);
      }
   };

   return (
      <main>
         <PostFeed posts={posts} admin={false} />

         {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}
         <Loader show={loading} />
         {postsEnd && 'No more posts!'}
      </main>
   );
}
