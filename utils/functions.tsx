export const calculateDifference = (itemPrice: number, userPrice: number) => {
  if (itemPrice > userPrice) {
    return `${itemPrice - userPrice}`;
  } else if (itemPrice < userPrice) {
    return false;
  }

  return itemPrice - userPrice;
};
