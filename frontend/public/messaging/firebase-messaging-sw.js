importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

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
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("message", (event) => {
  const { type, data } = event.data;

  if (type === "showNotification") {
    const { title, body } = data;
    self.registration.showNotification(title, {
      body: body,
      icon: "",
    });

    self.registration.showNotification(title);

    console.log(event);
  }
});
