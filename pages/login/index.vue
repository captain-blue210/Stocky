<template>
  <div
    class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col h-screen"
  >
    <p v-if="error" class="text-red-500">{{ error.message }}</p>
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
  ref,
  useRouter,
} from '@nuxtjs/composition-api';
import {
  EmailNotEnteredError,
  PasswordNotEnteredError,
  useLogin,
  User,
  useUserValidation,
} from '~/compositions/user';

export default defineComponent({
  setup() {
    const user: User = reactive({
      userID: '',
      name: '',
      mail: '',
      password: '',
    });
    const { login } = useLogin();
    const { validateEmailAndPassword } = useUserValidation();
    const router = useRouter();
    const error = ref<object | null>(null);

    const submit = async () => {
      try {
        validateEmailAndPassword(user.mail, user.password);
        await login(user.mail, user.password);
        router.push('/');
      } catch (e) {
        if (e instanceof EmailNotEnteredError) error.value = e;
        if (e instanceof PasswordNotEnteredError) error.value = e;
        if (e.code) {
          error.value = new Error(
            'ログインできませんでした。お手数ですが再度お試しください。',
          );
        }
      }
    };

    return {
      user,
      submit,
      error,
    };
  },
});
</script>
