import firebase from 'firebase/app';

export interface IPost {
   username: string;
   slug: any;
   title: string;
   heartCount: number;
   published: boolean;
   content: string;
   createdAt: firebase.firestore.Timestamp | number;
}

export interface UserFull {
   user: User;
   username: Username;
}

interface User {
   displayName: string;
   photoURL: string;
   username: string;
   uid: string;
   email: string;
}

interface Username {
   uid: string;
}
