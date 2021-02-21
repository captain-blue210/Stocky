/**
 * @jest-environment node
 */

import { assertSucceeds } from '@firebase/rules-unit-testing';
import { firestore as adminFirestore } from 'firebase-admin';
import * as uuid from 'uuid';
import * as helper from './firestore_rule_helper';

const TEST_AUTH = { uid: 'test_user', email: 'test_user@gmail.com' };
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

describe('firestore', () => {
  let projectID: string;
  beforeEach(async () => {
    projectID = helper.makeTestProjectID();
    await helper.loadRules(projectID);
  });

  describe('users', () => {
    describe('get operation', () => {
      it('can get user when userId equals uid', async () => {
        const adminDB = helper.adminApp(projectID).firestore();
        await adminDB.collection('users').doc(TEST_AUTH.uid).set({
          userID: TEST_AUTH.uid,
          name: 'test',
          createdAt: adminFirestore.FieldValue.serverTimestamp(),
        });

        const db = helper.app(projectID, TEST_AUTH).firestore();
        const doc = db.collection('users').doc(TEST_AUTH.uid);
        await assertSucceeds(doc.get());
      });
    });
  });

  describe('groups', () => {
    describe('get operation', () => {
      const groupdID = uuid.v4();
      const userID = uuid.v4();
      it('can get groups if user exists in groups', async () => {
        const adminDB = helper.adminApp(projectID).firestore();
        const ref = adminDB
          .collection('groups')
          .doc(groupdID)
          .collection('members')
          .doc(userID);

        await ref.set({
          userID,
          name: 'test',
          createdAt: adminFirestore.FieldValue.serverTimestamp(),
        });

        const db = helper
          .app(projectID, { uid: userID, email: 'test@gmail.com' })
          .firestore();

        const doc = db
          .collection('groups')
          .doc(groupdID)
          .collection('members')
          .doc(userID);

        await assertSucceeds(doc.get());
      });
    });
  });

  describe('foods', () => {
    describe('create operation', () => {
      const groupdID = uuid.v4();
      const foodID = uuid.v4();
      it('can create food', async () => {
        const adminDB = helper.adminApp(projectID).firestore();
        const ref = adminDB
          .collection('groups')
          .doc(groupdID)
          .collection('foods')
          .doc(foodID);

        await assertSucceeds(
          ref.set({
            foodID,
            foodName: 'foodtest',
            expiryDate: 'test',
            notificationDate: 'test',
            createdAt: adminFirestore.FieldValue.serverTimestamp(),
            updatedAt: adminFirestore.FieldValue.serverTimestamp(),
          }),
        );
      });
    });

    describe('get operation', () => {
      const groupdID = uuid.v4();
      const foodID = uuid.v4();
      it('can get foods if user exists in groups', async () => {
        const adminDB = helper.adminApp(projectID).firestore();
        await adminDB
          .collection('groups')
          .doc(groupdID)
          .collection('members')
          .doc(TEST_AUTH.uid)
          .set({
            userID: TEST_AUTH.uid,
            name: 'test',
            createdAt: adminFirestore.FieldValue.serverTimestamp(),
          });

        await adminDB
          .collection('groups')
          .doc(groupdID)
          .collection('foods')
          .doc(foodID)
          .set({
            foodID,
            foodName: 'foodtest',
            expiryDate: 'test',
            notificationDate: 'test',
            createdAt: adminFirestore.FieldValue.serverTimestamp(),
            updatedAt: adminFirestore.FieldValue.serverTimestamp(),
          });

        const db = helper.app(projectID, TEST_AUTH).firestore();

        const doc = db.collection('groups').doc(groupdID).collection('foods');
        await assertSucceeds(doc.get());
      });
    });
  });
});
