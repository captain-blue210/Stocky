import { defineNuxtMiddleware } from '@nuxtjs/composition-api';
import firebase from 'firebase/app';
import 'firebase/auth';

export default defineNuxtMiddleware((context) => {
  const user = firebase.auth().currentUser;

  if (!user) {
    context.app.$currentUser.value = null;
  } else {
    context.app.$currentUser.value = {
      userID: user.uid,
      name: user?.displayName!,
      mail: user?.email!,
      password: ''!,
    };
  }
  if (!context.app.$currentUser.value && context.route.path === '/') {
    context.redirect('/login');
  }
});
