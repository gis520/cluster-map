/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-11-11 20:27:38
 * @description: 聚合统计
 */
import { Injectable } from '@angular/core';
import { PROVINCES } from '../config/config';
import { MapApiLoadService } from '../shared/services/map-api-loader.service';
import { Observable, Subject, zip } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';


@Injectable()
export class VisualClusterService {
  private map = null;
  public distCluster = null;
  _subject$ = new Subject();
  http = null;
  loading = false;
  totals = 0;
  provincesData: any;
  monthsNumber: any[] = [];

  constructor(private msgSrv: NzMessageService, private mapApiSrv: MapApiLoadService) {
  }

  setMap(map) {
    this.map = map;
  }

  initCluster(lnglat: Array<any>) {
    this.mapApiSrv.load(['geo/DistrictCluster']).then(DistrictCluster => {
      (<any>window).DistrictCluster = DistrictCluster;
      this.distCluster = (<any>window).distCluster = new DistrictCluster({
        map: this.map, //所属的地图实例
        zIndex: 11,
        getPosition: (item) => {
          if (!item) {
            return null;
          }
          let parts = [];
          if (typeof item.split !== 'function' && Array.isArray(item)) {
            parts = [...item];
            return [parseFloat(parts[0]), parseFloat(parts[1])];
          }
          parts = item.split(',');
          //返回经纬度
          return [parseFloat(parts[0]), parseFloat(parts[1])];
        }
      });
      this.distCluster.setData(lnglat);
      this.clusterRecordResult(); //  根据省code获取数据
    });
  }

  genObservale(monthList: Array<string>) {
    const obsReqList = [];
    this.monthsNumber = [];
    for (let mon of monthList) {
      const obsReq = new Observable(observer => {
        let req = new Request(`/assets/data/${mon}.txt`, { method: 'GET', cache: 'reload' });
        fetch(req)
          .then(resp => {
            return resp.text();
          })
          .then(text => {
            const positionList = text.split('\n');
            this.monthsNumber.push({ name: mon, number: positionList.length }); //获取月份对应的订单量
            observer.next(positionList);
          });
      });
      obsReqList.push(obsReq);
    }
    return obsReqList;
  }

  queryData(dateArray) {
    // 避免起始月份是同一月、此时就会请求两次、占用资源
    const resetDateArr = dateArray.length === 2 && dateArray[0] === dateArray[1] ? [dateArray[0]] : dateArray;
    let monthReqs = this.genObservale(dateArray);
    const msgId = this.msgSrv.loading('数据查询中，请等待..', { nzDuration: 3000 }).messageId;
    this.loading = true;
    zip(...monthReqs).subscribe(
      data => {
        this.msgSrv.remove(msgId);
        this.msgSrv.info('地图数据渲染中……', { nzDuration: 2000 });
        let tempArr = [];
        for (let arr of data) {
          tempArr = tempArr.concat(arr);
        }
        this.loading = false;
        // tslint:disable-next-line:no-console
        // console.log(tempArr.length);
        this.totals = tempArr.length;
        this.initCluster(tempArr);

      },
      () => {
        this.msgSrv.error('订单坐标数据获取失败');
        this.loading = false;
      }
    );
  }
  // 第一个参数为政区code，440000 为广东省的，第二个为回调参数，res为获取到的数据结果  ---- 异步处理
  // this.distCluster.getClusterRecord(440000,(err,res)=>console.log(err,res))
  queryDataClusterRecord() {
    const allPromise = (PROVINCES || []).map(item => {
      return new Promise(resolve => {
        this.distCluster.getClusterRecord(item['code'], (err, res) => {
          resolve({ adcode: res.adcode, name: res.name, number: res.dataItems.length });
        });
      });
    });
    return Promise.all(allPromise || []);
  }

  async clusterRecordResult() {
    this.provincesData = (await this.queryDataClusterRecord()) || [];
    const arr = this.provincesData.sort((a, b) => (a.number > b.number ? 1 : -1));
    this._subject$.next(arr);
  }

}
