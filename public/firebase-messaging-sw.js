importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyAl13e_QtQ0zAvAfrwDblxzmXQZdBczMB4",
  authDomain: "coursewave-5cb7e.firebaseapp.com",
  projectId: "coursewave-5cb7e",
  storageBucket: "coursewave-5cb7e.appspot.com",
  messagingSenderId: "1084073748205",
  appId: "1:1084073748205:web:7f849860b1948e1ea18ee4",
  measurementId: "G-G6NHMGN9ZK",
};

firebaseConfig.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("message", (event) => {
  // Handle incoming messages from the main application
  const { type, data } = event.data;

  if (type === "showNotification") {
    const { title, body } = data;
    self.registration.showNotification(title, {
      body: body,
      icon: "",
    });

    // add the toast notification here
    self.registration.showNotification(title);

    console.log(event);
  }
});
