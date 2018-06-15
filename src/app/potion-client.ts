// export interface RequestOptions {
//   method?: 'OPTIONS' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'GET' | 'DELETE' | 'JSONP';
//   params?: URLSearchParams | QueryParams | null;
//   body?: any;
//   cache?: boolean;
//   paginate?: boolean;
// }
// export interface QueryParams {
//   page?: number;
//   perPage?: number;
//   where?: any;
//   sort?: any;
// }

// export type ItemFetchOptions = Pick<RequestOptions, 'cache'>;
// export type ItemQueryOptions = Pick<RequestOptions, 'cache' | 'paginate'>;

// declare const global: any;
// export function getGlobal(): any {
//     if (typeof self !== 'undefined') {
//         return self;
//     } else if (typeof window !== 'undefined') {
//         return window;
//     } else if (typeof global !== 'undefined') {
//         return global;
//     }
// }

// const _global = getGlobal();
// const Reflect = _global.Reflect; // tslint:disable-line: variable-name


// const POTION_URI_METADATA_KEY = Symbol('potion:uri');
// export function potionURI(ctor: typeof Item): string {
//     return Reflect.getOwnMetadata(POTION_URI_METADATA_KEY, ctor);
// }

// const POTION_METADATA_KEY = Symbol('potion');
// export function potionInstance(ctor: typeof Item): PotionBase {
//     return Reflect.getOwnMetadata(POTION_METADATA_KEY, ctor);
// }

// export abstract class Item {
//   [key: string]: any;

//   /**
//    * Get a resource by id.
//    * @param {Number|String} id
//    * @param {ItemFetchOptions} options
//    */
//   static fetch<T extends Item>(id: number | string, {cache = true}: ItemFetchOptions = {}): Promise<T> {
//       const uri: string = potionURI(this);
//       return potionInstance(this).fetch(`${uri}/${id}`, {
//           method: 'GET',
//           cache
//       });
//   }

//   /**
//    * Query resources.
//    * @param {QueryParams} [queryParams] - Can be used to manipulate the pagination with {page: number, perPage: number},
//    * but it can also be used to further filter the results with {sort: any, where: any}.
//    * @param {ItemFetchOptions} options
//    * @param {boolean} [options.paginate=false] - Setting {paginate: true} will result in the return value to be a Pagination object.
//    * @param {boolean} [options.cache=true] - Cache the HTTP request.
//    */
//   static query<T extends Item>(
//     queryParams?: QueryParams | null,
//     {paginate = false, cache = true}: ItemQueryOptions = {}): Promise<T[] | Pagination<T>> {
//       const uri: string = potionURI(this);
//       return potionInstance(this).fetch(uri, {
//           method: 'GET',
//           params: queryParams,
//           paginate,
//           cache
//       });
//   }

//   /**
//    * Get the first item.
//    * @param {QueryParams} [queryOptions] - Can be used to manipulate the pagination with {page: number, perPage: number},
//    * but it can also be used to further filter the results with {sort: any, where: any}.
//    */
//   static first<T extends Item>(queryOptions?: QueryParams): Promise<T> {
//       return this.query(queryOptions)
//           .then(first);
//       function first(items: T[]): T {
//           return items[0];
//       }
//   }

//   private $uri: string;
//   private $id: number | string | null = null;

//   /**
//    * Create an instance of the class that extended the Item.
//    * @param {Object} properties - An object with any properties that will be added and accessible on the resource.
//    */
//   constructor(properties?: ItemInitArgs) {
//       if (isJsObject(properties)) {
//           Object.assign(this, properties);
//       }
//   }

//   get uri(): string {
//       return this.$uri;
//   }
//   get id(): number | string | null {
//       return this.$id;
//   }

//   /**
//    * Compare current resource with another object.
//    * @param {Object} resource
//    */
//   equals(resource: any): boolean {
//       if (resource instanceof Item) {
//           return this.id === resource.id && this.constructor.name === resource.constructor.name;
//       }
//       return false;
//   }

//   /**
//    * Get the JSON repr. of this item.
//    */
//   toJSON(): any {
//       const properties: {[key: string]: any} = {};

//       Object.keys(this)
//           .filter(key => !key.startsWith('$') && !isReadonly(this.constructor, key))
//           .forEach((key: string) => {
//               properties[key] = this[key];
//           });

//       return properties;
//   }

//   /**
//    * Save the current item.
//    */
//   save(): Promise<this> {
//       if (this.uri || this.id) {
//           return this.update(this.toJSON());
//       }
//       const ctor = this.constructor as typeof Item;
//       return potionInstance(ctor)
//           .fetch(potionURI(ctor), {
//               method: 'POST',
//               body: this.toJSON(),
//               cache: true
//           });
//   }

//   /**
//    * Update the resource.
//    * @param {Object} data - An object with any properties to update.
//    */
//   update(data: any = {}): Promise<this> {
//       return potionInstance(this.constructor as typeof Item)
//           .fetch(this.uri, {
//               cache: true,
//               method: 'PATCH',
//               body: data
//           });
//   }

//   /**
//    * Destroy the current item.
//    */
//   destroy(): Promise<void> {
//       const uri = this.uri;
//       const potion = potionInstance(this.constructor as typeof Item);
//       const cache = potion.cache;
//       return potion.fetch(uri, {method: 'DELETE'})
//           .then(clearCache);
//       function clearCache(): void {
//           // Clear the item from cache if exists
//           if (cache.get(uri)) {
//               cache.remove(uri);
//           }
//       }
//   }
// }