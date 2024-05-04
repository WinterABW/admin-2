import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtilesService {

  constructor() {
  }

  getQueryParams = (params) => {
    let queryParameters = new HttpParams();
    if (params) {
      if (Object.keys(params).length > 0) {
        for (const param in params) {
          queryParameters = queryParameters.set(param, params[param]);
        }
      }
      return queryParameters;
    }
    return null
  };
  getBody = (params) => {
    const body = new FormData();
    if (params) {
      if (Object.keys(params).length > 0) {
        for (const param in params) {
          if (params[param] !== null || params[param] !== undefined) {
            body.append(param, params[param]);
          }
        }
      }
      return body;
    }
    return null
  };

  getDirtyValues(form: any) {
    const dirtyValues = {};

    Object.keys(form.controls)
      .forEach(key => {
        const currentControl = form.controls[key];

        if (currentControl.dirty) {
          if (currentControl.controls) {
            dirtyValues[key] = this.getDirtyValues(currentControl);
          } else {
            dirtyValues[key] = currentControl.value;
          }
        }
      });
    return dirtyValues;
  }
}
