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
        v-model="user.mail"
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
        v-model="user.password"
        class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
        type="password"
        placeholder="パスワードを入力してください"
      />
    </div>
    <div class="flex items-center justify-between">
      <button
        class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        type="button"
        @click="submit"
      >
        登録
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, useRouter } from '@nuxtjs/composition-api';
import { User, useSignup } from '~/compositions/user';

export default defineComponent({
  setup() {
    const user: User = reactive({
      userID: '',
      name: '',
      mail: '',
      password: '',
    });

    const router = useRouter();
    const { signup } = useSignup();
    const submit = () => {
      signup(user.mail, user.password);
      router.push('/');
    };

    return {
      user,
      submit,
    };
  },
});
</script>
