import { getUserWithUsername, postToJSON } from 'shared/firebase';
import UserProfile from 'components/UserProfile';
import PostFeed from 'components/PostFeed';

export async function getServerSideProps({ query }) {
   const { username } = query;

   const userDoc = await getUserWithUsername(username);

   let user = null;
   let posts = null;

   if (userDoc) {
      user = userDoc.data();
      const postsQuery = userDoc.ref
         .collection('posts')
         .where('published', '==', true)
         .orderBy('createdAt', 'desc')
         .limit(5);
      posts = (await postsQuery.get()).docs.map(postToJSON); // map(function(doc){const data = doc.data(); return data;})
   }

   return {
      props: { user, posts } // will be passed to the page component as props
   };
}

export default function UserProfilePage({ user, posts }) {
   return (
      <main>
         <UserProfile user={user} />
         <PostFeed posts={posts} admin={false} />
      </main>
   );
}
