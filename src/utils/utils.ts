import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_DEPLOYMENT_APP_URL}${path}`;
}

export function formatDateToMMDDYYYY(isoDate?: string | null): string {
  if (!isoDate) return "Invalid date";

  const date = new Date(isoDate);

  if (isNaN(date.getTime())) return "Invalid date";

  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

// "duration" is a numeric value indicating the number of minutes.
// Format it as "Xh Ym" for display. If it's 0, show "N/A".
export function formatCourseDuration(duration: number) {
  if (typeof duration === "number" && duration > 0) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  }
  return "N/A";
}

// export function formatNumber(number: number) {
//   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
// }
