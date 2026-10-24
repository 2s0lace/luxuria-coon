/**
 * Kształty z biblioteki Material 3 Expressive (ciasteczka, koniczyna, kwiat,
 * słoneczko) jako ścieżki SVG w polu 0–100.
 *
 * Każdy to krzywa biegunowa r = R · (1 + a·cos(nθ)) — n płatków, a głębokość
 * wcięć — wygładzona splajnem Catmulla-Roma. Liczone raz przy imporcie
 * i deterministyczne, więc serwer i przeglądarka dostają identyczny wynik
 * (brak ostrzeżeń hydracji).
 */
function polarShape(lobes: number, depth: number): string {
  const samples = lobes * 8;
  const radius = 50 / (1 + depth);
  const points: Array<[number, number]> = [];

  for (let i = 0; i < samples; i++) {
    const theta = (i / samples) * Math.PI * 2 - Math.PI / 2;
    const r = radius * (1 + depth * Math.cos(lobes * theta));
    points.push([50 + r * Math.cos(theta), 50 + r * Math.sin(theta)]);
  }

  const at = (i: number) => points[(i + samples) % samples];
  const f = (n: number) => n.toFixed(2);
  let d = `M${f(at(0)[0])},${f(at(0)[1])}`;

  for (let i = 0; i < samples; i++) {
    const [x0, y0] = at(i - 1);
    const [x1, y1] = at(i);
    const [x2, y2] = at(i + 1);
    const [x3, y3] = at(i + 2);
    d += `C${f(x1 + (x2 - x0) / 6)},${f(y1 + (y2 - y0) / 6)} ${f(x2 - (x3 - x1) / 6)},${f(y2 - (y3 - y1) / 6)} ${f(x2)},${f(y2)}`;
  }

  return `${d}Z`;
}

export const M3_SHAPES = {
  cookie9: polarShape(9, 0.07),
  cookie12: polarShape(12, 0.045),
  clover4: polarShape(4, 0.26),
  flower6: polarShape(6, 0.15),
  sunny: polarShape(10, 0.1),
  /** brylant w widoku z boku: płaska góra, rozszerzenie do talii, gładki dół */
  diamond:
    "M26,14L74,14Q78,14 80,16L96,32Q99,36 96,40L70.94,74.7C68.04,78.72 61.62,82 56.67,82L43.33,82C38.38,82 31.96,78.72 29.06,74.7L4,40Q1,36 4,32L20,16Q22,14 26,14Z",
} as const;

export type M3ShapeName = keyof typeof M3_SHAPES;

/** Owal jako ścieżka (dla poduszek łapki). */
function oval(cx: number, cy: number, rx: number, ry: number) {
  return `M${cx - rx},${cy}a${rx},${ry} 0 1,0 ${rx * 2},0a${rx},${ry} 0 1,0 ${-rx * 2},0Z`;
}

/**
 * Kocie kształty w tym samym miękkim języku co M3 Expressive: same łuki,
 * żadnych ostrych narożników, pole 0–100.
 */
export const CAT_SHAPES = {
  /** szeroka głowa: uszy w górnych rogach, wklęsłe czoło, zaokrąglony dół */
  head:
    "M8,12C7,8 10,6 14,8C28,16 38,25 50,25C62,25 72,16 86,8C90,6 93,8 92,12C91,20 87,28 85,36C91,45 93,55 91,65C88,83 70,93 50,93C30,93 12,83 9,65C7,55 9,45 15,36C13,28 9,20 8,12Z",
  /** duża poduszka i cztery paluszki */
  paw:
    "M50,50C65,50 80,63 80,76C80,86 72,93 63,93C57,93 54,89.5 50,89.5C46,89.5 43,93 37,93C28,93 20,86 20,76C20,63 35,50 50,50Z" +
    oval(19, 41, 9, 11) + oval(37, 24, 9, 11.5) + oval(63, 24, 9, 11.5) + oval(81, 41, 9, 11),
  /** pojedyncze kocie ucho — miękki trójkąt */
  ear: "M50,14C54,14 57,16 60,20L94,76C98,84 92,92 84,92L16,92C8,92 2,84 6,76L40,20C43,16 46,14 50,14Z",
  /** rybka; głowa po lewej, ogon po prawej */
  fish: "M9,46C20,32 48,27 64,40Q68,43 72,40L85,30C88,27.5 92,29 91.5,33Q90,41 88,47Q87,50 88,53Q90,59 91.5,67C92,71 88,72.5 85,70L72,60Q68,57 64,60C48,73 20,68 9,54Q6,50 9,46Z",
} as const;

export type CatShapeName = keyof typeof CAT_SHAPES;
