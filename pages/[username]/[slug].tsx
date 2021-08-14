import Link from 'next/link';
import styles from 'styles/Post.module.scss';
import PostContent from 'components/PostContent';
import { IPost } from 'model/server.model';
import { firestore, getUserWithUsername, postToJSON } from 'shared/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
// import HeartButton from 'components/HeartButton';
import AuthCheck from 'components/AuthCheck';
import ReactionButton from 'components/ReactionButton';

export async function getStaticProps({ params }) {
   const { username, slug } = params;
   const userDoc = await getUserWithUsername(username);

   if (!userDoc) {
      return {
         notFound: true
      };
   }

   let post: IPost;
   let path = null;

   if (userDoc) {
      const postRef = userDoc.ref.collection('posts').doc(slug);
      post = postToJSON(await postRef.get());
      path = postRef.path;
   }

   return {
      props: { post, path },
      revalidate: 5000
   };
}

export async function getStaticPaths() {
   // Improve my using Admin SDK to select empty docs
   const snapshot = await firestore.collectionGroup('posts').get();

   const paths = snapshot.docs.map(doc => {
      const { slug, username } = doc.data();
      return {
         params: { username, slug }
      };
   });

   return {
      // must be in this format:
      // paths: [
      //   { params: { username, slug }}
      // ],
      paths,
      fallback: 'blocking'
   };
   // TIPS: How next is going to return each time we create a new post because of dynamic data?
   // With traditional static generation next wouldnt know when we added a new post to db so it defaults to a 404 page is not found
   // How fallback blocking solves this issue?
   // When a user navigates to a not rendered page it tells next to fallback to regular server side rendering and cached into CDN like other pages.
}

export default function Post(props) {
   const postRef = firestore.doc(props.path);
   // TIP: react-firebase-hook to get feed of data in realitime
   const [realtimePost] = useDocumentData(postRef);
   const post = realtimePost || props.post;
   return (
      <main className={styles.container}>
         <section>
            <PostContent post={post} />
         </section>
         <aside className="card">
            <p>
               <strong>{post.heartCount || 0}</strong>
            </p>
            <AuthCheck
               fallback={
                  <Link href="/enter">
                     <button> Sign Up to add a Reaction</button>
                  </Link>
               }
            >
               <ReactionButton reaction={'heart'} postRef={postRef} />
               <ReactionButton reaction={'fake'} postRef={postRef} />
            </AuthCheck>
         </aside>
      </main>
   );
}
