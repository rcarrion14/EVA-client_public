export const retornarPrecioBTC = (
  prices: {
    tstamp: number;
    price: number;
  }[],
  tstampSec: number
) => {
  const onlyPrices: any = [];

  prices.forEach((priceAndTime, index) => {
    const price = priceAndTime.price;
    onlyPrices[index] = price;
  });

  const tstampDeployEva = 1720656000 * 1000;
  const secPorDia = 60 * 60 * 24 * 1000;

  const indice = Math.floor((tstampSec - tstampDeployEva) / secPorDia);

  return onlyPrices[indice];
};
