import { addYears, format } from 'date-fns';
import firebase from 'firebase/app';
import 'firebase/firestore';

export type Food = {
  foodID: string;
  foodName: string | null;
  expiryDate: string | null;
  notificationDate: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  canEdit: boolean;
};

// export const FoodsKey: InjectionKey<Ref<Food[]>> = Symbol('FoodsKey');
const db = firebase.firestore();
if (process.env.NODE_ENV === 'dev') {
  db.useEmulator('localhost', 8080);
}

export const useEmptyFood = (): Food => {
  //   const food = inject(FoodKey);
  const food: Food = {
    foodID: '',
    foodName: '',
    expiryDate: format(new Date(), 'yyyy-MM-dd'),
    notificationDate: format(addYears(new Date(), 1), 'yyyy-MM-dd'),
    createdAt: null,
    updatedAt: null,
    canEdit: true,
  };
  return food;
};

export const useRegistFood = () => {
  const registFood = async (food: Food, userID: string | undefined) => {
    const [expiryDateYear, expiryDateMonth, expiryDateDate] =
      food.expiryDate?.split('-').map((elm) => parseInt(elm)) ||
      ([] as number[]);

    const [notificationDateYear, notificationDateMonth, notificationDateDate] =
      food.notificationDate?.split('-').map((elm) => parseInt(elm)) ||
      ([] as number[]);

    await db
      .collection('users')
      .doc(userID)
      .collection('foods')
      .add({
        foodName: food.foodName,
        expiryDate: firebase.firestore.Timestamp.fromDate(
          new Date(expiryDateYear, expiryDateMonth - 1, expiryDateDate),
        ),
        notificationDate: firebase.firestore.Timestamp.fromDate(
          new Date(
            notificationDateYear,
            notificationDateMonth - 1,
            notificationDateDate,
          ),
        ),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .catch((e) => {
        throw e;
      });
  };
  return { registFood };
};

export const useUpdateFood = () => {
  const updateFood = async (food: Food, userID: string | undefined) => {
    if (!userID || !food.foodID) {
      throw new Error('userID or foodID is undefined');
    }

    const [expiryDateYear, expiryDateMonth, expiryDateDate] =
      food.expiryDate?.split('-').map((elm) => parseInt(elm)) ||
      ([] as number[]);

    const [notificationDateYear, notificationDateMonth, notificationDateDate] =
      food.notificationDate?.split('-').map((elm) => parseInt(elm)) ||
      ([] as number[]);

    await db
      .collection('users')
      .doc(userID)
      .collection('foods')
      .doc(food.foodID)
      .update({
        foodName: food.foodName,
        expiryDate: firebase.firestore.Timestamp.fromDate(
          new Date(expiryDateYear, expiryDateMonth - 1, expiryDateDate),
        ),
        notificationDate: firebase.firestore.Timestamp.fromDate(
          new Date(
            notificationDateYear,
            notificationDateMonth - 1,
            notificationDateDate,
          ),
        ),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .catch((e) => {
        throw e;
      });
  };
  return { updateFood };
};

export const useFoods = (userID: string | undefined) => {
  const foods: Food[] = [];

  db.collection('users')
    .doc(userID)
    .collection('foods')
    .onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          foods.push({
            foodID: change.doc.id,
            foodName: change.doc.data().foodName,
            expiryDate: format(
              change.doc.data().expiryDate.toDate(),
              'yyyy-MM-dd',
            ),
            notificationDate: format(
              change.doc.data().notificationDate.toDate(),
              'yyyy-MM-dd',
            ),
            createdAt: change.doc.data().createdAt,
            updatedAt: change.doc.data().updatedAt,
            canEdit: false,
          });
        }
      });
    });

  return foods;
};

export const useFoodNameValidation = () => {
  const validateFoodname = (foodName: string) => {
    if (!foodName) throw new FoodNameNotEnteredError();
  };
  return { validateFoodname };
};

export class FoodNameNotEnteredError extends Error {
  constructor(message = '食品名を入力してください') {
    super(message);
    this.name = 'FoodNameNotEnteredError';
  }
}
