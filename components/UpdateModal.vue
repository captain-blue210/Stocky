<template>
  <div>
    <!-- modal -->
    <div
      class="flex justify-center items-center fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 z-10"
      @click.self="close"
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
            @click.stop="close"
          >
            閉じる
          </a>
          <button
            class="bg-teal-500 hover:bg-teal-700 text-white font-bold m-2 py-2 px-4 rounded"
            @click="update"
          >
            更新
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from '@nuxtjs/composition-api';
import {
  Food,
  FoodNameNotEnteredError,
  useFoodNameValidation,
  useUpdateFood,
} from '~/compositions/food';
import {
  useCurrentUser,
  UserIDNotExistsError,
  useUserIDValidation,
} from '~/compositions/user';

export default defineComponent({
  props: {
    food: {
      type: Object,
      required: true,
    },
  },
  setup(props, context: SetupContext) {
    const { currentUser } = useCurrentUser();
    const item = props.food as Food;

    const error = ref<object | null>(null);
    const { validateFoodname } = useFoodNameValidation();
    const { validateUserID } = useUserIDValidation();

    const { updateFood } = useUpdateFood();
    const update = async () => {
      try {
        const foodName = item.foodName as string;
        validateFoodname(foodName);
        validateUserID(currentUser?.value);
        await updateFood(item, currentUser?.value?.userID);
        context.emit('close-update-modal', item.foodID);
      } catch (e) {
        if (
          e instanceof UserIDNotExistsError ||
          e instanceof FoodNameNotEnteredError
        )
          error.value = e;
        if (e.code) {
          error.value = new Error(
            '非常食の情報を更新できませんでした。お手数ですが再度お試しください。',
          );
        }
      }
    };

    const close = () => {
      context.emit('close-update-modal', item.foodID);
    };

    return {
      item,
      update,
      close,
      error,
    };
  },
});
</script>
