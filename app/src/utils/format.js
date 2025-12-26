export const BTC_EUR = 60000;

export const satToBtc = (sat) => sat / 1e8;

export const formatEUR = (value) =>
  value.toLocaleString("hr-HR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

export const formatTriple = (sat) => {
  const btc = satToBtc(sat);
  const eur = btc * BTC_EUR;
  return `${sat.toLocaleString("hr-HR")} sat · ${btc.toFixed(
    8
  )} BTC · €${formatEUR(eur)}`;
};
