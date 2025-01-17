import Bitrix from "@2bad/bitrix";

const bitrix = Bitrix(
  process.env.NEXT_PUBLIC_BITRIX24_API_URL!,
  "3ksesvu6gpspswfg6ch5t2n3x00hordd"
);

export default bitrix;
