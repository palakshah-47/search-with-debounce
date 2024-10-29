import { state, config } from '../_internal/state';
const reqConfig = config[state.step];

export function debounce<TFunc extends Function>(
  func: TFunc,
  timeout: number = reqConfig.debounce
) {
  let timer: number;
  return (...args: string[]) => {
    // if (!timeout) {
    //   console.log(func, args);
    //   func.apply(this, args);
    // } else {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      console.log(args);
      func.apply(this, args);
    }, timeout);
    // }
  };
}

