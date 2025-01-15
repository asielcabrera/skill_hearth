import { FirestoreDataConverter } from 'firebase-admin/firestore';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import User from '../types/User';

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)),
  databaseURL: process.env.FIREBASE_DB_URL
});

// Access Firestore
const firestore = admin.firestore();

const converter = <T>(): FirestoreDataConverter<T> => ({
    toFirestore: (data: T): FirebaseFirestore.DocumentData => {
        return data as unknown as FirebaseFirestore.DocumentData;
    },
    fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => snap.data() as T
});

const dataPoint = <T>(collectionPath: string) => firestore.collection(collectionPath).withConverter(converter<T>());


const db = {
	users: dataPoint<User>('users')
}

export { db };