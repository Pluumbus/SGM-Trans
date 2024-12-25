export const calculateCurrentPrize = (summ: number) => {
  const basePrize = 50000;
  const calcPrize = (perc) => basePrize + ((basePrize * perc) / 100) * 2;
  switch (true) {
    case summ >= 15500000 && summ < 16000000:
      return basePrize;
    case summ >= 16000000 && summ < 20000000:
      return calcPrize(3.23);
    case summ >= 20000000 && summ < 25000000:
      return calcPrize(29.03);
    case summ >= 25000000 && summ < 30000000:
      return calcPrize(61.29);
    case summ >= 30000000 && summ < 40000000:
      return calcPrize(93.55);
    case summ >= 40000000:
      return calcPrize(158.06);
    default:
      return 0;
  }
};
