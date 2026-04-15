import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SelectListItem, ServiceProxy } from './services';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class SelectListItemService {
  constructor(private http: HttpClient, private _serviceProxy: ServiceProxy) {}
  selectListItems: SelectListItem[] = [];
  getSelectListItems(type: string, cascadeValue: string): Observable<SelectListItem[]> {
    return this._serviceProxy.getSelectListItem(type, cascadeValue);
  }

  getEnumSelectListItems(type: string): Observable<SelectListItem[]> {
    return this._serviceProxy.getEnumSelectListItem(type);
  }
}