"use client"; // required for {HeroSection} lottie-react because it use (useState) internally

import React, { useEffect, useState } from "react";
import About from "@/components/LandingPage/about";
import Footer from "@/components/LandingPage/footer";
import { useRouter } from "next/navigation";
import * as scrollAnimation from "./ScrollAnimation.json";
import Offerings from "@/components/LandingPage/offerings";
import LandingPageHeader from "@/components/LandingPage/header";
import HeroSection from "@/components/LandingPage/hero-section";
import Testimonials from "@/components/LandingPage/testimonials";
import { firebaseClourdMessaging } from "@/config/firebase";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <main className="flex dark:bg-black dark:bg-opacity-80 h-full flex-col items-center justify-between  ">
      <LandingPageHeader handleLoginClick={handleLoginClick} />

      <div className="p-10 h-full">
        <HeroSection scrollAnimation={scrollAnimation} />

        <div className="space-y-32 h-full">
          <About />

          <Offerings />

          {/* <SessionsSection /> */}

          <Testimonials />

          {/* <HomeBrowseSection /> */}
        </div>
      </div>

      <Footer />
    </main>
  );
}

// const [fcmToken, setFcmToken] = useState<string | (() => Promise<string | null>) | null | undefined>(undefined);
// const [messages, setMessages] = useState<string>("");

// const getToken = async () => {
//   try {
//     const token = await firebaseClourdMessaging.init();
//     if (token) {
//       await firebaseClourdMessaging.getMesage();
//       setFcmToken(token);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// useEffect(() => {
//   if ("serviceWorker" in navigator) {
//     navigator.serviceWorker.register("/firebase-messaging-sw.js").then(registeration => {
//       console.log(
//         "Service worker registered successfully: ", registeration
//       );
//     }).catch(error => {
//       console.error("Service worker registration failed: ", error);
//     });

//     navigator.serviceWorker.addEventListener("message", event => {
//       console.log(event.data.notification);
//       setMessages(event.data.notification.title);
//       toast.success(event.data.notification.title, { id: `success_1` });
//     })
//   }

//   async function setToken() {
//     await getToken();
//   }

//   setToken();
// }, [messages]);

// async function requestPermission() {
//   const permission = await Notification.requestPermission();

//   if (permission === "granted") {
//     if ("serviceWorker" in navigator) {
//       // generate token
//       getToken(messaging, {
//         vapidKey:
//           "BAYg4fh0-1oS_wLEGz4hlG_RPW89jhCc3VojLJcZ_UbTwy9Zk_WRmSHO6r2m3Bcv78VeB4JY0W72qmL3xviEfII",
//       })
//         .then((currentToken) => {
//           if (currentToken) {
//             // Send the token to your server and update the UI if necessary
//             console.log("Firebase Generated token", currentToken);
//             return currentToken;
//           } else {
//             // Show permission request UI
//             console.log(
//               "No registration token available. Request permission to generate one."
//             );
//           }
//         })
//         .catch((err) => {
//           console.log("An error occurred while retrieving token. ", err);
//         });
//     } else {
//       console.log("Service Worker not supported");
//     }
//   } else if (permission === "denied") {
//     alert("You denied for the notification");
//   }
// }

// useEffect(() => {
//   requestPermission();
// }, []);

// useEffect(() => {
//   if ("serviceWorker" in navigator) {
//     const handleServiceWorker = async () => {
//       const register = await navigator.serviceWorker.register("/sw.js");

//       const subscription = await register.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: "WEB_PUSH_PUBLIC_KEY",
//       });

//       const res = await fetch(
//         absoluteUrl(`${process.env.NEXT_PUBLIC_APP_URL!}/notify`),
//         {
//           method: "PATCH",
//           body: JSON.stringify(subscription),
//           headers: {
//             "content-type": "application/json",
//           },
//         }
//       );

//       const data = await res.json();
//       console.log(data);
//     };
//     handleServiceWorker();
//   }
// }, []);
