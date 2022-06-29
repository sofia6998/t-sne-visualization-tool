// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_throttle
export function throttle(func: any, timeFrame: number) {
  let lastTime: number = new Date(0).getTime();
  return (...args: any) => {
    const now = new Date().getTime();
    if (now - lastTime >= timeFrame) {
      func(...args);
      lastTime = now;
    }
  };
}