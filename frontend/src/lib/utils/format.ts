export const formatPrice = (
  price: number,
  currency: string = "USD", // Default to USD if no currency is provided
  options: Intl.NumberFormatOptions = {}, // Allow additional options
): string => {
  if (!currency) {
    throw new Error("Currency code is required with currency style.");
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    ...options, // Merge with any additional options
  }).format(price);
};

export const formatDate = (
  input: string | number,
  options: Intl.DateTimeFormatOptions = {
    // Default options
    month: "long",
    day: "numeric",
    year: "numeric",
  },
): string => {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", options);
};

// utils/formatDate.ts
export const formatDateFromString = (dateString: string): string => {
  // Create a Date object from the input string
  const date = new Date(dateString);

  // Extract the day, month, and year
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() returns 0-indexed month
  const year = date.getFullYear();

  // Format day and month to always have two digits
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  // Return the formatted date in DD/MM/YYYY format
  return `${formattedDay}/${formattedMonth}/${year}`;
};


export const formatTime = (
  input: string | number,
  options: Intl.DateTimeFormatOptions = {
    // Default options
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }
): string => {
  const date = new Date(input);
  return date.toLocaleTimeString("en-US", options);
};

export const formatPercentage = (
  value: number,
  options: Intl.NumberFormatOptions = {
    // Default options
    style: "percent",
    maximumFractionDigits: 2,
  }
): string => {
  return new Intl.NumberFormat("en-US", options).format(value);
};

export const formatDuration = (duration: number): string => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(1)} GB`;
};

export const formatPhoneNumber = (number: string): string => {
  const cleaned = ('' + number).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1,3})(\d{1,4})(\d{1,4})(\d{1,9})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }
  return number;
};

export const formatName = (name: string): string => {
  return name.split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

export function formatNumber(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}