/**
 * Object type guard
 * Docs: https://www.typescriptlang.org/docs/handbook/advanced-types.html
 */
export function isJsObject(value: any): value is {[key: string]: any} {
  return typeof value === 'object' && value !== null;
}

/**
* Check if an object is empty
*/
export function isObjectEmpty(obj: {}): boolean {
  return Object.keys(obj).length === 0;
}

/**
* Check if a value is a string
*/
export function isString(value: any): value is string {
  return typeof value === 'string';
}

/**
* Function type guard
*/
// tslint:disable-next-line: ban-types
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

/**
 * Get global object
 * https://github.com/hemanth/es-next#global
 */
declare const global: any;
export function getGlobal(): any {
    if (typeof self !== 'undefined') {
        return self;
    } else if (typeof window !== 'undefined') {
        return window;
    } else if (typeof global !== 'undefined') {
        return global;
    }
}
