<template>
  <div
    class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col h-screen"
  >
    <div class="mb-4">
      <label class="block text-grey-darker text-sm font-bold mb-2" for="mail">
        メールアドレス
      </label>
      <input
        id="mail"
        v-model="mail"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
        type="email"
        placeholder="メールアドレス"
      />
    </div>
    <div class="mb-6">
      <label
        class="block text-grey-darker text-sm font-bold mb-2"
        for="password"
      >
        パスワード
      </label>
      <input
        id="password"
        v-model="password"
        class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
        type="password"
        placeholder="パスワード"
      />
    </div>
    <div class="flex items-center justify-between">
      <button
        class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        type="button"
        @click="submit"
      >
        ログイン
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  useContext,
} from '@nuxtjs/composition-api';
import { useLogin, User } from '~/compositions/user';

export default defineComponent({
  setup() {
    const user: User = reactive({
      name: '',
      mail: '',
      password: '',
    });

    const { login } = useLogin();
    const { app } = useContext();

    const submit = async () => {
      console.log(user.mail, user.password);
      await login(user.mail, user.password);
      await app.router!.push('/');
    };
    return {
      ...toRefs(user),
      submit,
    };
  },
});
</script>
