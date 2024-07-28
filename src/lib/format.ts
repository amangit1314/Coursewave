export const formatPrice = (price: number, currency: string) => {
  if (!currency) {
    throw new Error("Currency code is required with currency style.");
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,  // Use the provided currency code directly
  }).format(price);
};

export const formatDate = (input: string | number): string => {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
