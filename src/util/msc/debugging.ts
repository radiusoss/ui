import { beep } from './beep';

export function instrumentMethod(target: any, methodName: string) {
  const originalMethod = target[methodName];

  target[methodName] = function() {
    beep();

    var startTime = performance.now();
    var retVal = originalMethod.apply(this, arguments);
    var duration = performance.now() - startTime;

    /* tslint:disable:no-console */
    if (duration <= 1) {
      console.log(`${ methodName } called`, getStackTrace());
    } else if (duration <= 10) {
      console.warn(`${ methodName } called, took ${ Math.round(duration * 1000) / 1000 }ms`, getStackTrace());
    } else {
      console.error(`${ methodName } called, took ${ Math.round(duration * 1000) / 1000 }ms`, getStackTrace());
    }
    /* tslint:enable:no-console */

    return retVal;
  };
}

export function getStackTrace() {
  var obj = {
    stack: ''
  };

  /* tslint:disable:no-string-literal */
  const captureStackTrace = Error['captureStackTrace'];
  /* tslint:enable:no-string-literal */

  if (captureStackTrace) {
    captureStackTrace(obj, getStackTrace);
    var stackEntries = obj.stack.split('at ');

    obj.stack = stackEntries[2];
  }

  return obj.stack;
}
