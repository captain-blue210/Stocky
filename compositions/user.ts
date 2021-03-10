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

    await auth
      .createUserWithEmailAndPassword(mail, password)
      .then(async (res) => {
        const uid = res.user?.uid;

        const db = firebase.firestore();
        if (process.env.NODE_ENV === 'dev') {
          db.useEmulator('localhost', 8080);
        }

        await db.collection('users').doc(uid).set({
          email: res.user?.email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      })
      .catch((e) => {
        throw e;
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

    await auth.signInWithEmailAndPassword(mail, password).catch((e) => {
      throw e;
    });
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

export const useUserIDValidation = () => {
  const validateUserID = (user: User | null | undefined) => {
    if (!user || !user.userID) throw new UserIDNotExistsError();
  };
  return { validateUserID };
};

export const useEmailAndPasswordValidation = () => {
  const validateEmailAndPassword = (mail: string, password: string) => {
    if (!mail) throw new EmailNotEnteredError();
    if (!password) throw new PasswordNotEnteredError();
  };
  return { validateEmailAndPassword };
};

export class UserIDNotExistsError extends Error {
  constructor(message = 'UserIDがありません') {
    super(message);
    this.name = 'UserIDNotExistsError';
  }
}

export class EmailNotEnteredError extends Error {
  constructor(message = 'メールアドレスを入力してください') {
    super(message);
    this.name = 'EmailNotEnteredError';
  }
}

export class PasswordNotEnteredError extends Error {
  constructor(message = 'パスワードを入力してください') {
    super(message);
    this.name = 'PasswordNotEnteredError';
  }
}
