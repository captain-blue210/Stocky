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
          <td><input v-model="food.foodName" type="text" name="name" /></td>
          <td>
            <input v-model="food.expiryDate" type="date" name="expiryDate" />
          </td>
          <td>
            <input
              v-model="food.notificationDate"
              type="date"
              name="check-date"
            />
          </td>
          <td>
            <button @click="registFood(food)">登録</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@nuxtjs/composition-api';
import { useEmptyFood, useRegistFood } from '~/compositions/food';

export default defineComponent({
  middleware: ['auth'],
  setup() {
    const food = reactive(useEmptyFood());
    const { registFood } = useRegistFood();
    return {
      food,
      registFood,
    };
  },
});
</script>
