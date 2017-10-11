export default (prev = (() => {}), next) => (...args) => next(prev, ...args);
