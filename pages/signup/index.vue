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
        登録
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
  User,
  useSignup,
  EmailNotEnteredError,
  PasswordNotEnteredError,
} from '~/compositions/user';

export default defineComponent({
  setup() {
    const user: User = reactive({
      userID: '',
      name: '',
      mail: '',
      password: '',
    });
    const error = ref<object | null>(null);
    const router = useRouter();
    const { signup } = useSignup();

    const submit = async () => {
      try {
        await signup(user.mail, user.password);
        if (error) error.value = null;
        router.push('/');
      } catch (e) {
        if (e instanceof EmailNotEnteredError) error.value = e;
        if (e instanceof PasswordNotEnteredError) error.value = e;
        if (e.code) {
          error.value = new Error(
            'ユーザー登録できませんでした。お手数ですが再度お試しください。',
          );
        }
      }
    };

    return {
      user,
      error,
      submit,
    };
  },
});
</script>
