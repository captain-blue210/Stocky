<template>
  <div class="container mx-auto h-screen">
    <h1 class="text-xl m-3">
      <font-awesome-icon
        :icon="'list'"
        size="lg"
        class="text-teal-500 mr-2"
      />非常食リスト
    </h1>
    <table class="w-full mt-3 border-collapse table-auto">
      <thead class="border-b-2 border-gray-500 mx-3">
        <tr>
          <th>食品名</th>
          <th>消費期限</th>
          <th>見直し日</th>
          <th>
            <font-awesome-icon
              :icon="'edit'"
              size="sm"
              class="text-teal-500 mr-2"
            />編集
          </th>
          <th>
            <font-awesome-icon
              :icon="'trash'"
              size="sm"
              class="text-teal-500 mr-2"
            />削除
          </th>
        </tr>
      </thead>
      <tbody class="text-center divide-y-2">
        <tr v-for="food in foods" :key="food.foodID">
          <td class="p-2">
            {{ food.foodName }}
          </td>
          <td>
            {{ food.expiryDate }}
          </td>
          <td>
            {{ food.notificationDate }}
          </td>
          <update-modal
            v-show="food.canEdit"
            :food="food"
            @close-update-modal="closeUpdateModal"
          />
          <td>
            <button
              class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-4 rounded"
              type="button"
              @click="openUpdateModal(food.foodID)"
            >
              編集
            </button>
          </td>
          <td>
            <input
              :id="food.foodID"
              v-model="deleteFoodList"
              type="checkbox"
              name="deleteFood"
              :value="food.foodID"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex flex-row justify-end">
      <button
        class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-4 mt-3 rounded"
        type="button"
        @click="submitToDelete"
      >
        削除
      </button>
    </div>
    <input-modal />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api';
import InputModal from '@/components/InputModal.vue';
import UpdateModal from '@/components/UpdateModal.vue';
import {
  Food,
  FoodNameNotEnteredError,
  useDeleteFoods,
  useFoods,
} from '~/compositions/food';
import {
  useCurrentUser,
  UserIDNotExistsError,
  useUserIDValidation,
} from '~/compositions/user';

export default defineComponent({
  components: {
    InputModal,
    UpdateModal,
  },
  setup() {
    const { currentUser } = useCurrentUser();
    const error = ref<object | null>(null);
    const { validateUserID } = useUserIDValidation();

    const foods = ref([] as Food[]);
    useFetch(async () => {
      try {
        validateUserID(currentUser?.value);
        const result = await useFoods(currentUser?.value?.userID);
        foods.value = result;
      } catch (e) {
        if (
          e instanceof UserIDNotExistsError ||
          e instanceof FoodNameNotEnteredError
        )
          error.value = e;
        if (e.code) {
          error.value = new Error(
            '非常食リストを取得できませんでした。お手数ですが再度お試しください。',
          );
        }
      }
    });

    const openUpdateModal = (foodID: string) => {
      foods.value = foods.value.map((food) => {
        if (food.foodID === foodID) {
          food.canEdit = true;
        }
        return food;
      });
    };

    const closeUpdateModal = async (foodID: string) => {
      foods.value = foods.value.map((food) => {
        if (food.foodID === foodID) {
          food.canEdit = false;
        }
        return food;
      });
      const result = await useFoods(currentUser?.value?.userID);
      foods.value = result;
    };

    const deleteFoodList = ref<string[]>([]);
    const { deleteFoods } = useDeleteFoods();
    const submitToDelete = async () => {
      deleteFoods(currentUser?.value?.userID, deleteFoodList.value);
      const result = await useFoods(currentUser?.value?.userID);
      foods.value = result;
    };

    return {
      currentUser,
      foods,
      error,
      openUpdateModal,
      closeUpdateModal,
      deleteFoodList,
      submitToDelete,
    };
  },
});
</script>
