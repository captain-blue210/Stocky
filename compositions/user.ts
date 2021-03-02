import { inject, InjectionKey, Ref } from '@nuxtjs/composition-api';
// import { Symbol } from 'core-js';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export type User = {
  userID: string;
  name: string;
  mail: string;
  password: string;
};

export const CurrentUser: InjectionKey<Ref<User | null>> = Symbol(
  'CurrentUser',
);

export const useCurrentUser = () => {
  const currentUser = inject(CurrentUser);
  return {
    currentUser,
  };
};

export const useSignup = () => {
  const signup = async (mail: string, password: string) => {
    const auth = firebase.auth();

    if (process.env.NODE_ENV === 'dev') {
      auth.useEmulator('http://localhost:9099');
    }
    const res = await auth.createUserWithEmailAndPassword(mail, password);
    const uid = res.user?.uid;

    const db = firebase.firestore();
    if (process.env.NODE_ENV === 'dev') {
      db.useEmulator('localhost', 8080);
    }

    await db.collection('users').doc(uid).set({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };
  return { signup };
};

export const useLogin = () => {
  const login = async (mail: string, password: string) => {
    const auth = firebase.auth();
    if (process.env.NODE_ENV === 'dev') {
      auth.useEmulator('http://localhost:9099');
    }
    await auth.signInWithEmailAndPassword(mail, password);
  };
  return { login };
};

export const useLogout = () => {
  const logout = async () => {
    const auth = await firebase.auth();
    if (process.env.NODE_ENV === 'dev') {
      auth.useEmulator('http://localhost:9099');
    }
    await auth.signOut();
  };
  return { logout };
};
