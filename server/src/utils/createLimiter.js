import { AppError } from './AppError.js';

// Simple limiter: ek saath max N tasks chalenge, baaki queue mein.
// Queue bhi bhar gayi to turant 503 (server ko bachane ke liye).
export function createLimiter({ maxConcurrent, maxQueue }) {
  let active = 0;
  const queue = [];

  function next() {
    if (active >= maxConcurrent || queue.length === 0) return;
    active++;
    const { task, resolve, reject } = queue.shift();
    task()
      .then(resolve, reject)
      .finally(() => {
        active--; // chahe success ho ya error, slot wapas free
        next();
      });
  }

  return function run(task) {
    return new Promise((resolve, reject) => {
      if (active >= maxConcurrent && queue.length >= maxQueue) {
        return reject(
          new AppError('Server abhi busy hai. Thodi der baad try karo.', 503)
        );
      }
      queue.push({ task, resolve, reject });
      next();
    });
  };
}