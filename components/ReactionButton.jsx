import { firestore, auth, increment } from 'shared/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';

export default function ReactionButton({ postRef, reaction }) {
   // Listen to heart document for currently logged in user
   const reactionRef = postRef.collection(reaction).doc(auth.currentUser.uid);
   const [reactionDoc] = useDocument(reactionRef);
   const count = `${reaction}Count`;

   // Create a user-to-post relationship
   const addReaction = async () => {
      const uid = auth.currentUser.uid;
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

   // if the doc exist we know we have already a reaction
   return reactionDoc?.exists ? (
      <button onClick={removeReaction}>{reaction}-</button>
   ) : (
      <button onClick={addReaction}>{reaction}+</button>
   );
}
