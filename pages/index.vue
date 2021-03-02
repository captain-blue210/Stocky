<template>
  <div class="h-screen">
    <table class="w-full m-3 border-collapse">
      <thead class="border-b-2 border-gray-500">
        <tr>
          <th>名前</th>
          <th>消費期限</th>
          <th>見直し日</th>
        </tr>
      </thead>
      <tbody class="text-center divide-y-2">
        <tr>
          <td>
            <input v-model="item.foodName" type="text" name="name" />
          </td>
          <td>
            <input v-model="item.expiryDate" type="date" name="expiryDate" />
          </td>
          <td>
            <input
              v-model="item.notificationDate"
              type="date"
              name="notificationDate"
            />
          </td>
          <td>
            <button @click="submit">登録</button>
          </td>
        </tr>
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
import { useEmptyFood, useFoods, useRegistFood } from '~/compositions/food';
import { useCurrentUser } from '~/compositions/user';

export default defineComponent({
  setup() {
    const { currentUser } = useCurrentUser();
    const item = ref(useEmptyFood());

    const foods = ref({});
    useFetch(async () => {
      const result = await useFoods(currentUser?.value?.userID);
      foods.value = result;
    });

    const { registFood } = useRegistFood();
    const submit = () => {
      registFood(item.value, currentUser?.value?.userID);
      item.value = useEmptyFood();
    };

    return {
      item,
      registFood,
      currentUser,
      foods,
      submit,
    };
  },
});
</script>
