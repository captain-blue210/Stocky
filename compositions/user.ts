import firebase from 'firebase';

export type User = {
  mail: string;
  password: string;
};

export const signUp = async (user: User) => {
  const auth = firebase.auth();

  if (process.env.NODE_ENV === 'development') {
    auth.useEmulator('http://localhost:9099');
  }
  await auth.createUserWithEmailAndPassword(user.mail, user.password);
};
