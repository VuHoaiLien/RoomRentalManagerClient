import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class CategoryCacheService {
  private cache: {
    [key: string]: any
  } = {};
  get<T>(key: string):T | undefined{
    return this.cache[key];
  }
  set<T>(key: string, data: T):void{
    this.cache[key] = data;
  }

  clear(key: string): void{
    delete this.cache[key];
  }
}