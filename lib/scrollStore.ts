// Module-level mutable state — read in useFrame, written by scroll listener
// No React re-renders involved
export const scrollState = {
  progress: 0, // 0 = top of page, 1 = scrolled 1 viewport height
}
