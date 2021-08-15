import { firestore, auth, increment } from 'shared/firebase';
import { useDocument, useDocumentData } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';

export default function ReactionButton({ postRef, reaction }) {
   console.log('🌊 ~ file: ReactionButton.jsx ~ line 6 ~ ReactionButton ~ postRef', useDocumentData(postRef));
   const router = useRouter();
   // Listen to heart document for currently logged in user
   const reactionRef = postRef.collection(reaction).doc(auth.currentUser.uid);
   const [reactionDoc] = useDocument(reactionRef);
   const count = `${reaction}Count`;

   // Create a user-to-post relationship
   const addReaction = async () => {
      const uid = auth.currentUser.uid;
      if (reaction === 'donate') donate(uid);
      const batch = firestore.batch();
      batch.update(postRef, { [count]: increment(1) });
      batch.set(reactionRef, { uid });
      await batch.commit();
   };

   // Remove a user-to-post relationship
   const removeReaction = async () => {
      const batch = firestore.batch();
      batch.update(postRef, { [count]: increment(-1) });
      batch.delete(reactionRef);
      await batch.commit();
   };

   const donate = uid => {
      router.push(`/donate/${uid}`);
   };

   // if the doc exist we know we have already a reaction
   return reactionDoc?.exists ? (
      <button onClick={removeReaction}>{reaction}-</button>
   ) : (
      <button onClick={addReaction}>{reaction}+</button>
   );
}
