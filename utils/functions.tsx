export const calculateDifference = (itemPrice: number, userPrice: number) => {
  if (itemPrice > userPrice) {
    return `${itemPrice - userPrice}`;
  } else if (itemPrice < userPrice) {
    return false;
  }

  return itemPrice - userPrice;
};

export const getCurrencySymbol = (currency: string) => {
  const symbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "C$",
    INR: "₹",
  };
  return symbols[currency] || currency;
};
