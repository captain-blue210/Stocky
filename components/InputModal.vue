<template>
  <div>
    <div
      v-show="!showModal"
      class="flex fixed bottom-0 right-0 mr-12 mb-12 cursor-pointer"
    >
      <div @click="toggleModal">
        <font-awesome-icon
          :icon="'plus-circle'"
          size="3x"
          class="text-teal-500"
        />
      </div>
    </div>
    <!-- modal -->
    <div
      v-show="showModal"
      class="flex justify-center items-center fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
      @click.self="toggleModal"
    >
      <div class="bg-white p-5 rounded-xl z-20">
        <p v-if="error" class="text-red-500 ml-3">
          {{ error.message }}
        </p>
        <div class="container mx-auto mb-12 flex flex-row flex-wrap">
          <div class="flex flex-col flex-auto m-2">
            <label for="name" class="text-gray-700">食品名</label>
            <input
              v-model="item.foodName"
              type="text"
              name="name"
              class="h-8 border-b-2 border-gray-700 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div class="flex flex-col flex-auto m-2">
            <label for="name" class="text-gray-700 m-1">消費期限</label>
            <input v-model="item.expiryDate" type="date" name="expiryDate" />
          </div>
          <div class="flex flex-col flex-auto m-2">
            <label for="name" class="text-gray-700 m-1">見直し日</label>
            <input
              v-model="item.notificationDate"
              type="date"
              name="notificationDate"
            />
          </div>
        </div>
        <div class="flex flex-row justify-end">
          <a
            class="hover:text-teal-700 font-bold m-2 py-2 px-4 rounded cursor-pointer"
            @click="toggleModal"
          >
            閉じる
          </a>
          <button
            class="bg-teal-500 hover:bg-teal-700 text-white font-bold m-2 py-2 px-4 rounded"
            @click="submit"
          >
            登録
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import {
  useEmptyFood,
  useRegistFood,
  useFoodNameValidation,
} from '~/compositions/food';
import { useCurrentUser } from '~/compositions/user';
const ClickOutside = require('vue-click-outside');

export default defineComponent({
  directives: {
    ClickOutside,
  },
  setup() {
    const { currentUser } = useCurrentUser();
    const showModal = ref<boolean>(false);
    const toggleModal = () => {
      showModal.value = !showModal.value;
    };
    const hideModal = () => {
      showModal.value = false;
    };
    const item = ref(useEmptyFood());
    const error = ref<object | null>(null);

    const { registFood } = useRegistFood();
    const { validateFoodname } = useFoodNameValidation();
    const submit = async () => {
      try {
        const foodName = item.value.foodName as string;
        validateFoodname(foodName);
        await registFood(item.value, currentUser?.value?.userID);
        item.value = useEmptyFood();
        hideModal();
      } catch (e) {
        error.value = e;
      }
    };

    return {
      showModal,
      toggleModal,
      hideModal,
      item,
      submit,
      error,
    };
  },
});
</script>
