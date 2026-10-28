import { map, computed } from 'nanostores';

type Inputs = {
  a: string;
  b: string;
};

type Parsed = {
  a: number | null;
  b: number | null;
};

// One writable store holding the raw text of both input boxes.
// Everything else is derived.
export const inputs$ = map<Inputs>({
  a: '6',
  b: '3',
});

// Parsed numbers, or null when a box is empty or not a valid number.
export const parsed$ = computed(inputs$, (inputs: Inputs): Parsed => {
  return {
    a: parse(inputs.a),
    b: parse(inputs.b),
  };
});

// Converts the text of an input box to a number. Returns null for blank text
// and for anything that isn't a finite number (e.g. "abc", "Infinity").
function parse(text: string): number | null {
  if (text.trim() === '') {
    return null;
  }
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}

// Each result is null until both inputs are valid numbers.
export const sum$ = computed(parsed$, ({ a, b }: Parsed) => {
  if (a === null || b === null) {
    return null;
  }
  return a + b;
});

export const difference$ = computed(parsed$, ({ a, b }: Parsed) => {
  if (a === null || b === null) {
    return null;
  }
  return a - b;
});

export const product$ = computed(parsed$, ({ a, b }: Parsed) => {
  if (a === null || b === null) {
    return null;
  }
  return a * b;
});

export const quotient$ = computed(parsed$, ({ a, b }: Parsed) => {
  if (a === null || b === null) {
    return null;
  }
  return a / b;
});

export const remainder$ = computed(parsed$, ({ a, b }: Parsed) => {
  if (a === null || b === null) {
    return null;
  }
  return a % b;
});

export const power$ = computed(parsed$, ({ a, b }: Parsed) => {
  if (a === null || b === null) {
    return null;
  }
  return a ** b;
});

export const max$ = computed(parsed$, ({ a, b }: Parsed) => {
  if (a === null || b === null) {
    return null;
  }
  return Math.max(a, b);
});

// The original, more compact version. It builds each derived store from a
// helper that handles the null check once.
//
// // Builds a derived store that is null until both inputs are valid.
// function createBinaryFn(fn: (a: number, b: number) => number): ReadableAtom<number | null> {
//   return computed(parsed$, ({ a, b }: Parsed) => {
//     if (a === null || b === null) {
//       return null;
//     }
//     return fn(a, b);
//   });
// }
//
// export const sum$ = createBinaryFn((a: number, b: number) => a + b);
// export const difference$ = createBinaryFn((a: number, b: number) => a - b);
// export const product$ = createBinaryFn((a: number, b: number) => a * b);
// export const quotient$ = createBinaryFn((a: number, b: number) => a / b);
// export const remainder$ = createBinaryFn((a: number, b: number) => a % b);
// export const power$ = createBinaryFn((a: number, b: number) => a ** b);
// export const max$ = createBinaryFn((a: number, b: number) => Math.max(a, b));
