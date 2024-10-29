let step: number;

try {
  step = parseInt(localStorage.getItem('step'), 10) || 1;
} catch {
  step = 1;
}

export const state = { step };

export const config: Record<
  string,
  {
    errors: number;
    delay: number;
    debounce: number;
  }
> = {
  1: {
    // Extra labels
    errors: 0,
    delay: 0,
    debounce: 500,
  },
  2: {
    // Wrong query
    errors: 0,
    delay: 4000,
    debounce: 500,
  },
  3: {
    // Slow typing
    errors: 0,
    delay: 4000,
    debounce: 50,
  },
  4: {
    // Slow server
    errors: 0,
    delay: 8000,
    debounce: 50,
  },
  5: {
    // Errors
    errors: 0.25,
    delay: 400,
    debounce: 500,
  },
  6: {
    // Misc
    errors: 0.25,
    delay: 4000,
    debounce: 500,
  },
};
