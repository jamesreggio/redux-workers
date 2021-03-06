import wrap from './wrap';

const magicKey = '@@redux-remote';

export default (worker, options = {}) => ({dispatch}) => {
  const {
    prepareAction = ({meta = {}, ...action}) => {
      const {broadcast, ...restMeta} = meta;
      return broadcast ? {meta: restMeta, ...action} : null;
    },
  } = options;

  worker.onmessage = wrap(worker.onmessage, (onmessage, message) => {
    onmessage(message);
    if (message != null && magicKey in message) {
      dispatch(message.action);
    }
  });

  return (next) => (action) => {
    const prepared = prepareAction(action);
    if (prepared) {
      worker.postMessage({
        [magicKey]: true,
        action: prepared,
      });
    }
    return next(action);
  };
};
