import {
  defineNuxtPlugin,
  onGlobalSetup,
  onUnmounted,
  provide,
  ref,
} from '@nuxtjs/composition-api';
import firebase from 'firebase/app';
import 'firebase/auth';
import { CurrentUser, User } from '~/compositions/user';

export default defineNuxtPlugin(async (context, inject) => {
  const currentUser = ref<User | null>(null);
  inject('currentUser', currentUser);

  const unsubscribe: any = await new Promise((resolve) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        currentUser.value = null;
      } else {
        currentUser.value = {
          userID: user.uid,
          name: user?.displayName!,
          mail: user?.email!,
          password: ''!,
        };
      }
      resolve(unsubscribe);
    });
  });

  onGlobalSetup(() => {
    provide(CurrentUser, currentUser);
    onUnmounted(unsubscribe);
  });
});
