// interface DebounceConstructor {
//   (func: () => void, wait: number, immediate?: boolean): DebouncedFunction
// }

// interface DebouncedFunction {
//   (...args: unknown[]): Promise<unknown>
//   cancel(): void
//   doImmediately(...args: unknown[]): Promise<unknown>
// }

// const debounce: DebounceConstructor = (
//   func: () => Promise<void>,
//   wait: number,
//   immediate?: boolean,
// ) => {
//   let timeout: NodeJS.Timeout | undefined = undefined
//   const debouncedFn: DebouncedFunction = (...args) =>
//     new Promise((resolve) => {
//       clearTimeout(timeout)
//       timeout = setTimeout(() => {
//         timeout = undefined
//         if (!immediate) {
//           void Promise.resolve(func.apply([...args])).then(resolve)
//         }
//       }, wait)
//       if (immediate && !timeout) {
//         void Promise.resolve(func.apply([...args])).then(resolve)
//       }
//     })

//   debouncedFn.cancel = () => {
//     clearTimeout(timeout)
//     timeout = undefined
//   }

//   debouncedFn.doImmediately = (...args) =>
//     new Promise((resolve) => {
//       clearTimeout(timeout)
//       timeout = setTimeout(() => {
//         timeout = undefined
//         void Promise.resolve(func.apply([...args])).then(resolve)
//       }, 0)
//     })

//   return debouncedFn
// }

// export default debounce
