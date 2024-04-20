// useCookie.tsx
import { createContext, useState, useEffect } from "react";

const CookieContext = createContext(null);

export const useCookie = () => {
  const [cookieData, setCookieData] = useState({});

  useEffect(() => {
    const getCookie = async () => {
      const cookies = await document.cookie.split(";");
      const cookieObj = {};

      for (const cookie of cookies) {
        const [key, value] = cookie.trim().split("=");
        cookieObj[key] = value;
      }

      setCookieData(cookieObj);
    };

    getCookie();
  }, []);

  return cookieData;
};

export default CookieContext;
