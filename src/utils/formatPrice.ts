export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ar-EG", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US").format(amount);
};
