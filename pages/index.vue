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
          <td>乾パン</td>
          <td><input type="date" name="use-by" :value="dateValue" /></td>
          <td><input type="date" name="check-date" :value="dateValue" /></td>
        </tr>
        <tr>
          <td>乾パン</td>
          <td><input type="date" name="use-by" :value="dateValue" /></td>
          <td><input type="date" name="check-date" :value="dateValue" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from '@nuxtjs/composition-api';

export default defineComponent({
  setup() {
    const today: Date = new Date();
    const dateValue: Ref<string> = ref(
      `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
    );
    return {
      dateValue,
    };
  },
});
</script>
