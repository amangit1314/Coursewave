import { getMessaging, getToken, onMessage } from "firebase/messaging";
import * as firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAl13e_QtQ0zAvAfrwDblxzmXQZdBczMB4",
  authDomain: "coursewave-5cb7e.firebaseapp.com",
  projectId: "coursewave-5cb7e",
  storageBucket: "coursewave-5cb7e.appspot.com",
  messagingSenderId: "1084073748205",
  appId: "1:1084073748205:web:7f849860b1948e1ea18ee4",
  measurementId: "G-G6NHMGN9ZK"
};

const firebaseClourdMessaging = {
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
            vapidKey: "BAYg4fh0-1oS_wLEGz4hlG_RPW89jhCc3VojLJcZ_UbTwy9Zk_WRmSHO6r2m3Bcv78VeB4JY0W72qmL3xviEfII"
          });

          if (fcm_token) {
            localStorage.setItem("fcm_token", fcm_token);
            console.log('fcm_token: ', fcm_token);

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
            vapidKey: "BAYg4fh0-1oS_wLEGz4hlG_RPW89jhCc3VojLJcZ_UbTwy9Zk_WRmSHO6r2m3Bcv78VeB4JY0W72qmL3xviEfII"
          });

          if (fcm_token) {
            localStorage.setItem("fcm_token", fcm_token);
            console.log('fcm_token: ', fcm_token);
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
  getMesage: async function () {
    if (firebase.getApps().length > 0) {
      try {
        const messaging = getMessaging();
        onMessage(messaging, payload => {
          console.log("Message Recieved", payload);
        })
      } catch (error) {

      }
    }
  }
}

export { firebaseClourdMessaging };