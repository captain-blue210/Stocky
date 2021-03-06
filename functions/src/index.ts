import * as sgMail from '@sendgrid/mail';
import { format } from 'date-fns';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.initializeApp().firestore();
sgMail.setApiKey(functions.config().sendgrid.key);

exports.dailyNotificationSender = functions
  .region('asia-northeast1')
  .pubsub.schedule('0 10 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async (context) => {
    const jst = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    const todayStart = new Date(jst);
    todayStart.setHours(0, 0, 0);
    const todayEnd = new Date(jst);
    todayEnd.setHours(23, 59, 59);

    const usersSnapshot = await db.collection('users').get();
    type user = { uid: string; email: string };
    const users: user[] = [];
    usersSnapshot.forEach((doc) => {
      users.push({
        uid: doc.id,
        email: doc.data().email,
      });
    });

    users.forEach(async (user) => {
      const snapshot = await db
        .collection('users')
        .doc(user.uid)
        .collection('foods')
        // .orderBy('notificationDate', 'desc')
        // .startAt(todayStart)
        // .endAt(todayEnd)
        .where(
          'notificationDate',
          '>=',
          admin.firestore.Timestamp.fromDate(todayStart),
        )
        .where(
          'notificationDate',
          '<=',
          admin.firestore.Timestamp.fromDate(todayEnd),
        )
        .get();

      const text = snapshot.docs
        .map(
          (doc) =>
            `食品名：${doc.data().foodName} 期限日：${format(
              doc.data().expiryDate.toDate(),
              'yyyy-MM-dd',
            )}<br>`,
        )
        .join('');

      const msg = {
        to: user.email,
        from: 'stockyapp7@gmail.com',
        subject: '本日見直しが必要な非常食リスト',
        text: text,
        html: text,
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email Sent');
        })
        .catch((error) => {
          console.error(JSON.stringify(error));
        });
    });
  });
