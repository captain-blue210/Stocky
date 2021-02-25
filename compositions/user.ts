import { InjectionKey, onUnmounted, Ref, ref } from '@nuxtjs/composition-api';
import firebase from 'firebase/app';
import 'firebase/auth';

export type User = {
  name: string;
  mail: string;
  password: string;
};

export const CurrentUser: InjectionKey<Ref<User | null>> = Symbol();

export const useCurrentUser = () => {
  const currentUser = ref<User | null>(null);
  const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      currentUser.value = null;
    }

    currentUser.value = {
      name: user?.displayName!,
      mail: user?.email!,
      password: ''!,
    };
  });

  onUnmounted(unsubscribe);
  return {
    currentUser,
  };
};

export const signUp = async (mail: string, password: string) => {
  const auth = firebase.auth();

  if (process.env.NODE_ENV === 'development') {
    auth.useEmulator('http://localhost:9099');
  }
  await auth.createUserWithEmailAndPassword(mail, password);
};

export const useLogin = () => {
  const login = async (mail: string, password: string) => {
    const auth = await firebase.auth();
    if (process.env.NODE_ENV === 'development') {
      auth.useEmulator('http://localhost:9099');
    }
    await auth.signInWithEmailAndPassword(mail, password);
  };
  return { login };
};
