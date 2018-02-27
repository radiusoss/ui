export let stripString = (str: string, maxChars: number) => {
  if (str.length <= maxChars) return str
  if (str.length > maxChars) return str.substring(0,maxChars - 3) + '...'
}

export const toastrSuccessOptions = {
//    id: id,
//            attention: true,
//    timeOut: 20000,
//    onOk: () => console.log('OK: clicked'),
//    onCancel: () => console.log('CANCEL: clicked')
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isDefined(x) {
  return x !== null && x !== undefined;
}

export function isFunction(functionToCheck) {
  const getType = {};
  return !!functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
