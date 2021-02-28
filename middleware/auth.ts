import { defineNuxtMiddleware } from '@nuxtjs/composition-api';

export default defineNuxtMiddleware(({ app, route, redirect }) => {
  console.log(JSON.stringify(app.$currentUser));
  if (!app.$currentUser.value && route.path === '/') {
    redirect('/login');
  }
});
