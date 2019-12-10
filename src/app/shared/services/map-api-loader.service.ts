/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-11-11 20:27:52
 * @description: 动态按需加载 amap ui 组件，（ngx-amap模块还不支持 amap ui)
 */

import { Injectable } from '@angular/core';
import { AMAPUI_API_URL } from '../../config/config';
declare const AMapUI;

@Injectable()
export class MapApiLoadService {
  private _mapLoaded: Promise<any>;

  constructor() {}

  load(name: Array<string>): any {
    // tslint:disable-next-line: no-console
    console.log('loading UI plugin:', name);
    return this.apiLoad().then(() => {
      return new Promise(resolve => {
        // tslint:disable-next-line: no-console
        console.log('loading UI  plugin:', name, 'COMPLETE');
        AMapUI.loadUI([...name], res => resolve(res));
      });
    });
  }

  /**异步问题，一次只能加载一个UI库 */
  apiLoad() {
    if (this._mapLoaded) {
      return this._mapLoaded;
    }
    // tslint:disable-next-line: no-console
    console.log('loading AMapUI api...');

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = `${AMAPUI_API_URL}`;

    this._mapLoaded = new Promise<void>((resolve: Function, reject: Function) => {
      script.onload = () => {
        // tslint:disable-next-line: no-console
        console.log('loading AMap UI api COMPLETE');
        resolve();
      };

      script.onerror = (error: Event) => {
        reject(error);
      };
    });

    document.body.appendChild(script);
    return this._mapLoaded;
  }
}
