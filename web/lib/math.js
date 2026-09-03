/**
 * Typeset TeX with MathJax, which loads from a CDN after the page script and may arrive after
 * a view has rendered. `typeset` waits for it (bounded), so a page never stays untypeset;
 * `resetMath` clears equation numbers and labels before a new page renders.
 */
const LOAD_WAIT_MS = 30000;

function loaded() {
  return typeof window.MathJax?.typesetPromise === "function";
}

function ready() {
  if (loaded()) return Promise.resolve(true);
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(loaded()), LOAD_WAIT_MS);
    window.addEventListener("mathjax-ready", () => { clearTimeout(timer); resolve(loaded()); }, { once: true });
  });
}

export async function typeset(element) {
  if (!(await ready())) return;
  try {
    await window.MathJax.typesetPromise([element]);
  } catch (error) {
    console.warn("MathJax could not typeset this page", error);
  }
}

/** Forget the previous page's equation numbers and labels; the same statement may appear again. */
export function resetMath() {
  if (!loaded()) return;
  window.MathJax.typesetClear?.();
  window.MathJax.texReset?.();
}
