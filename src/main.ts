import './style.css';
import { effect } from 'nanostores';
import type { ReadableAtom } from 'nanostores';
import {
  inputs$,
  parsed$,
  sum$,
  difference$,
  product$,
  quotient$,
  remainder$,
  power$,
  max$,
} from './stores';

// Input boxes write into the store...
function bindInput(input: HTMLInputElement, key: 'a' | 'b'): void {
  inputs$.setKey(key, input.value);
  // changes in DOM are stored in the signal
  input.addEventListener('input', () => {
    inputs$.setKey(key, input.value);
  });
}

// ...and output cells subscribe to derived stores. subscribe() runs
// immediately with the current value, then again on every change.
function bindOutput(id: string, store$: ReadableAtom<number | null>): void {
  const cell = document.querySelector<HTMLElement>(`#${id}`)!;
  store$.subscribe((value) => {
    // changes in _signal__  are stored in the _DOM_
    cell.textContent = value === null ? '—' : String(value);
  });
}

bindInput(document.querySelector<HTMLInputElement>('#input-a')!, 'a');
bindInput(document.querySelector<HTMLInputElement>('#input-b')!, 'b');

bindOutput('out-sum', sum$);
bindOutput('out-difference', difference$);
bindOutput('out-product', product$);
bindOutput('out-quotient', quotient$);
bindOutput('out-remainder', remainder$);
bindOutput('out-power', power$);
bindOutput('out-max', max$);

// effect() runs a side effect whenever any of the listed stores change.
// Unlike subscribe(), it can take several stores at once, and the callback
// receives their values as separate arguments. Here it shows or hides a
// warning, and also keeps the browser tab title in sync with the sum.
const warning = document.querySelector<HTMLElement>('#warning')!;

effect([parsed$, sum$], (parsed, sum) => {
  warning.hidden = parsed.b !== 0;
  document.title = sum === null ? 'Nanostores Calculator' : `Sum = ${sum}`;
});
