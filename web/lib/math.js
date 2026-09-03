/**
 * Typeset TeX with MathJax, which loads from a CDN after the page script and may arrive after
 * a view has rendered. `typeset` waits for it once, bounded; if it never arrives, later calls
 * return at once and the page simply shows TeX source. `resetMath` clears equation numbers and
 * labels before a new page renders.
 */
const LOAD_WAIT_MS = 20000;
let readiness = null;

function loaded() {
  return typeof window.MathJax?.typesetPromise === "function";
}

function ready() {
  if (loaded()) return Promise.resolve(true);
  readiness ??= new Promise((resolve) => {
    const timer = setTimeout(() => resolve(loaded()), LOAD_WAIT_MS);
    window.addEventListener("mathjax-ready", () => { clearTimeout(timer); resolve(loaded()); }, { once: true });
  });
  return readiness;
}

/**
 * Typeset an element. With MathJax present the returned promise covers the typesetting; while
 * it is still loading, the typeset is scheduled for its arrival and the page is not held up.
 */
export function typeset(element) {
  const run = async () => {
    if (!(await ready())) return;
    try {
      await window.MathJax.typesetPromise([element]);
    } catch (error) {
      console.warn("MathJax could not typeset this page", error);
    }
  };
  if (loaded()) return run();
  void run();
  return Promise.resolve();
}

/** Forget the previous page's equation numbers and labels; the same statement may appear again. */
export function resetMath() {
  if (!loaded()) return;
  window.MathJax.typesetClear?.();
  window.MathJax.texReset?.();
}
