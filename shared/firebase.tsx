import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
   apiKey: 'AIzaSyCURkvV7W3dGHWwnWH0j8F4Y60HG_ESOUQ',
   authDomain: 'team-3s.firebaseapp.com',
   projectId: 'team-3s',
   storageBucket: 'team-3s.appspot.com',
   messagingSenderId: '755175421855',
   appId: '1:755175421855:web:e8ea4351cd435f454eafaa',
   measurementId: 'G-6WW36TT2GL'
};



if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider(); // this Provider tells which pop up to use

export const firestore = firebase.firestore();
export const fromMillis = firebase.firestore.Timestamp.fromMillis; // SOS Much more reliable that javascript Date

// FieldValue
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

// Special way to update a firestore document that allows you to update an existing count on the document without knowing the current count on the server.
export const increment = firebase.firestore.FieldValue.increment;

export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
   const usersRef = firestore.collection('users');
   const query = usersRef.where('username', '==', username).limit(1);
   const userDoc = (await query.get()).docs[0];
   return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
   const data = doc.data();

   return {
      ...data,
      // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
      createdAt: data?.createdAt?.toMillis() || null,
      updatedAt: data?.updatedAt?.toMillis() || null
   };
}
