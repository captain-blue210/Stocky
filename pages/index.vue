<template>
  <div class="h-screen">
    <p v-if="error" class="text-red-500 ml-3">
      {{ error.message }}
    </p>
    <div class="mb-12 flex flex-row mx-3">
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
      <div class="flex flex-col m-2">
        <button
          class="bg-teal-500 hover:bg-teal-700 text-white font-bold mt-5 py-2 px-4 rounded"
          @click="submit"
        >
          登録
        </button>
      </div>
    </div>
    <table class="w-full m-3 border-collapse">
      <thead class="border-b-2 border-gray-500 mx-3">
        <tr>
          <th>商品名</th>
          <th>消費期限</th>
          <th>見直し日</th>
        </tr>
      </thead>
      <tbody class="text-center divide-y-2">
        <tr v-for="food in foods" :key="food.foodID">
          <td>{{ food.foodName }}</td>
          <td>{{ food.expiryDate }}</td>
          <td>{{ food.notificationDate }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api';
import {
  useEmptyFood,
  useFoodNameValidation,
  useFoods,
  useRegistFood,
} from '~/compositions/food';
import { useCurrentUser } from '~/compositions/user';

export default defineComponent({
  setup() {
    const { currentUser } = useCurrentUser();
    const item = ref(useEmptyFood());
    const error = ref<object | null>(null);
    const { validateFoodname } = useFoodNameValidation();

    const foods = ref({});
    useFetch(async () => {
      const result = await useFoods(currentUser?.value?.userID);
      foods.value = result;
    });

    const { registFood } = useRegistFood();
    const submit = async () => {
      try {
        const foodName = item.value.foodName as string;
        validateFoodname(foodName);
        await registFood(item.value, currentUser?.value?.userID);
        item.value = useEmptyFood();
      } catch (e) {
        error.value = e;
      }
    };

    return {
      item,
      registFood,
      currentUser,
      foods,
      submit,
      error,
    };
  },
});
</script>
