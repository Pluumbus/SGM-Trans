export const calculateCurrentPrize = (summ: number) => {
  const bP = 50000;
  const calcPerc = (summ * 100) / 15500000 - 100;
  const newFormula = bP + bP * calcPerc * 2;
  const calcPrize = (perc) => bP + ((bP * perc) / 100) * 2;
  switch (true) {
    case summ >= 15500000 && summ < 16000000:
      return bP;
    case summ >= 16000000 && summ < 20000000:
      return calcPrize(calcPerc);
    case summ >= 20000000 && summ < 25000000:
      return calcPrize(calcPerc);
    case summ >= 25000000 && summ < 30000000:
      return calcPrize(calcPerc);
    case summ >= 30000000 && summ < 40000000:
      return calcPrize(calcPerc);
    case summ >= 40000000:
      return calcPrize(calcPerc);
    default:
      return 0;
  }
};
