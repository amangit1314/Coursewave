import { getMessaging, getToken, onMessage } from "firebase/messaging";
import * as firebase from "firebase/app";

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const firebaseCloudMessaging = {
  tokenInLocalStorage: async () => {
    return localStorage.getItem("fcm_token");
  },
  init: async function () {
    if (!firebase.getApps().length) {
      firebase.initializeApp(firebaseConfig);

      try {
        const messaging = getMessaging();
        const tokenInLocalStorage = await this.tokenInLocalStorage;

        if (tokenInLocalStorage !== null) {
          return tokenInLocalStorage;
        }

        const status = await Notification.requestPermission();

        if (status && status === "granted") {
          const fcm_token = await getToken(messaging, {
            vapidKey: process.env.FIREBASE_VAPID_KEY!,
          });

          if (fcm_token) {
            localStorage.setItem("fcm_token", fcm_token);
            console.log("fcm_token: ", fcm_token);

            return fcm_token;
          }

          return null;
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    } else {
      try {
        const messaging = getMessaging();
        const tokenInLocalStorage = await this.tokenInLocalStorage;

        if (tokenInLocalStorage !== null) {
          return tokenInLocalStorage;
        }

        const status = await Notification.requestPermission();
        if (status && status === "granted") {
          const fcm_token = await getToken(messaging, {
            vapidKey: process.env.FIREBASE_VAPID_KEY!,
          });

          if (fcm_token) {
            localStorage.setItem("fcm_token", fcm_token);
            console.log("fcm_token: ", fcm_token);
            return fcm_token;
          }

          return null;
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  },
  getMesage: async  () => {
    if (firebase.getApps().length > 0) {
      try {
        const messaging = getMessaging();
        onMessage(messaging, (payload) => {
          console.log("Message Recieved", payload);
        });
      } catch (error) {}
    }
  },
};

export { firebaseCloudMessaging };
