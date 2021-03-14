<template>
  <header class="bg-teal-500 text-white body-font">
    <div
      class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center"
    >
      <nuxt-link
        class="flex title-font font-medium items-center mb-4 md:mb-0"
        to="/"
      >
        <span class="ml-3 text-2xl">Stocky</span>
      </nuxt-link>
      <nav
        class="md:ml-auto flex lg:w-25 flex-wrap justify-center items-center text-base"
      >
        <nuxt-link
          v-if="!currentUser"
          to="/signup"
          class="mr-5 hover:text-gray-900"
          >ユーザー登録</nuxt-link
        >
        <nuxt-link
          v-if="!currentUser"
          to="/login"
          class="mr-5 hover:text-gray-900"
          >ログイン</nuxt-link
        >
        <div v-else>
          <a
            id="user-menu"
            v-click-outside="hideDropdown"
            class="mr-3 cursor-pointer"
            aria-haspopup="true"
            @click="isDropdownOpen = !isDropdownOpen"
          >
            {{ currentUser.mail }}
          </a>
          <div
            v-show="isDropdownOpen"
            class="origin-top-right absolute right-0 mt-2 mr-10 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu"
          >
            <button
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              @click="doLogout"
            >
              ログアウト
            </button>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, useRouter } from '@nuxtjs/composition-api';
import { useCurrentUser, useLogout } from '~/compositions/user';
const ClickOutside = require('vue-click-outside');

export default defineComponent({
  directives: {
    ClickOutside,
  },
  setup() {
    const { currentUser } = useCurrentUser();
    const router = useRouter();
    const { logout } = useLogout();
    const doLogout = async () => {
      await logout();
      router.push('/login');
    };

    const isDropdownOpen = ref(false);
    const hideDropdown = () => {
      isDropdownOpen.value = false;
    };

    return { currentUser, isDropdownOpen, hideDropdown, doLogout };
  },
});
</script>
