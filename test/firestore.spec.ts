import * as firebase from '@firebase/rules-unit-testing';

const PROJECT_ID = 'stocky-3a86f';

describe('firestore test', () => {
  test('can not read when all denied', async () => {
    const db = firebase
      .initializeTestApp({ projectId: PROJECT_ID })
      .firestore();
    const doc = db.collection('test').doc();
    await firebase.assertSucceeds(doc.get());
  });
});
