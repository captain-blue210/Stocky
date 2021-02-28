<template>
  <header class="bg-teal-500 text-white body-font">
    <div
      class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center"
    >
      <a class="flex title-font font-medium items-center mb-4 md:mb-0">
        <span class="ml-3 text-2xl">Stocky</span>
      </a>
      <nav
        class="md:ml-auto flex flex-wrap items-center text-base justify-center"
      >
        <button
          v-if="!currentUser"
          class="mr-5 text-teal-500 bg-white py-2 px-4 font-bold rounded"
          @click="goToLogin"
        >
          ログイン
        </button>
        <div v-else>
          <button
            id="user-menu"
            v-click-outside="hideDropdown"
            class="mr-5"
            aria-haspopup="true"
            @click="isDropdownOpen = !isDropdownOpen"
          >
            {{ currentUser.mail }}
          </button>
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
    const goToLogin = () => {
      router.push('/login');
    };
    const { logout } = useLogout();
    const doLogout = async () => {
      await logout();
      router.push('/login');
    };

    const isDropdownOpen = ref(false);
    const hideDropdown = () => {
      isDropdownOpen.value = false;
    };

    return { goToLogin, currentUser, isDropdownOpen, hideDropdown, doLogout };
  },
});
</script>
