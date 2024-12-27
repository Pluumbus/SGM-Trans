const customTransliterateMap: { [key: string]: string } = {
  a: "а",
  b: "б",
  v: "в",
  g: "г",
  d: "д",
  e: "е",
  yo: "ё",
  zh: "ж",
  z: "з",
  i: "и",
  y: "й",
  k: "к",
  l: "л",
  m: "м",
  n: "н",
  o: "о",
  p: "п",
  r: "р",
  s: "с",
  t: "т",
  u: "у",
  f: "ф",
  kh: "х",
  ts: "ц",
  ch: "ч",
  sh: "ш",
  shch: "щ",
  yu: "ю",
  ya: "я",
  A: "А",
  B: "Б",
  V: "В",
  G: "Г",
  D: "Д",
  E: "Е",
  Yo: "Ё",
  Zh: "Ж",
  Z: "З",
  I: "И",
  Y: "Й",
  K: "К",
  L: "Л",
  M: "М",
  N: "Н",
  O: "О",
  P: "П",
  R: "Р",
  S: "С",
  T: "Т",
  U: "У",
  F: "Ф",
  Kh: "Х",
  Ts: "Ц",
  Ch: "Ч",
  Sh: "Ш",
  Shch: "Щ",
  Yu: "Ю",
  Ya: "Я",
};

export function customTransliterateToRus(text: string): string {
  const reverese = Object.entries(Object.keys(customTransliterateMap));
  return text
    .split("")
    .map((char) => reverese[char] || char)
    .join("");
}
export function reverseTransliterate(fileName: string): string {
  let result = fileName;

  // Сортируем ключи словаря по длине в обратном порядке, чтобы сначала заменить длинные сочетания (например, shch)
  const keys = Object.keys(customTransliterateMap).sort(
    (a, b) => b.length - a.length,
  );

  keys.forEach((latin) => {
    const cyrillic = customTransliterateMap[latin];
    // Заменяем все вхождения латинского сочетания на кириллический символ
    result = result.replace(new RegExp(latin, "g"), cyrillic);
  });

  return result;
}
