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
        const db = helper.app(projectID, TEST_AUTH).firestore();
        const doc = db.collection('users').doc(TEST_AUTH.uid);
        await assertSucceeds(doc.get());
      });
    });
  });

  describe('groups', () => {
    const groupdID = uuid.v4();
    const userID = uuid.v4();
    beforeEach(async () => {
      const adminDB = helper.adminApp(projectID).firestore();
      await adminDB
        .collection('groups')
        .doc(groupdID)
        .collection('members')
        .doc(userID)
        .set({
          name: 'blue210',
          createdAt: adminFirestore.FieldValue.serverTimestamp(),
        });
    });

    it('can get groups when userId exists in groups', async () => {
      const db = helper
        .app(projectID, {
          email: 'test@gmail.com',
          uid: userID,
        })
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
