import firebase from 'firebase';

export type User = {
  mail: string;
  password: string;
};

export const signUp = async (user: User) => {
  const auth = firebase.auth();
  auth.useEmulator('http://localhost:9099');
  await auth.createUserWithEmailAndPassword(user.mail, user.password);
};
