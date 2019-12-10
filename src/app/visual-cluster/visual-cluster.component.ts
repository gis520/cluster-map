import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MAP_ZOOMS, YEAR_MONTH } from '../config/config';
import { differenceInCalendarMonths, differenceInCalendarYears } from 'date-fns';
import * as moment from 'moment';
import { NgxAmapComponent } from 'ngx-amap';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { VisualClusterService } from './cluster.service';

@Component({
  selector: 'app-visual-cluster',
  templateUrl: './visual-cluster.component.html',
  styleUrls: ['./visual-cluster.component.scss'],
})
export class VisualClusterComponent implements OnInit, AfterViewInit, OnDestroy {
  mapConfig = {
    level: 5,
    zooms: MAP_ZOOMS
  };
  maxHight = '600px';
  centerPoint = [116.397368, 39.90923];
  startDate = null;
  endDate = null;
  monthFormat = 'yyyy/MM';
  subject: Subscription;
  disabledStartDate: any;
  disabledEndDate: any;
  showBox = false;
  chartData: any;
  @ViewChild(NgxAmapComponent, { static: false })
  private mapComponent: NgxAmapComponent;

  constructor(private clusterSrv: VisualClusterService) { }
  ngOnInit() {
    this.maxHight = window.innerHeight - 50 + 'px';
    this.loadData();
  }

  loadData() {
    const monthsRange = this.caculateMonths();
    this.clusterSrv.queryData(monthsRange);
  }

  reset() {
    this.initDate();
  }

  initDate() {
    // 动态
    /* const initDate = moment(new Date())
      .subtract(1, 'months')
      .format('YYYY/MM');
    this.startDate = this.endDate = new Date(initDate); // 默认选择当前月份的前一个月
    return [initDate];  */
    this.startDate = new Date('2019/06');
    this.endDate = new Date('2019/09');
    return ['2019/06', '2019/09'];
  }

  caculateMonths() {
    if (!this.startDate || !this.endDate) {
      return this.initDate();
    }
    const dateArr = [];
    const startDateStr = moment(this.startDate);
    const endDateStr = moment(this.endDate);
    const dateIff = endDateStr.diff(startDateStr, 'months'); //计算两月份间差值
    for (let i = 0; i <= dateIff; i++) {
      dateArr.push(
        moment(this.startDate)
          .add(i, 'months')
          .format('YYYY/MM')
      );
    }
    return dateArr;
  }
  // this.initDateStr =>>> YEAR_MONTH.end
  // 打开起始月份面板
  handleStartOpenChange(open: boolean): void {
    // 禁用当前月份之后、或者结束月份的所有月份
    const initEndDate = moment(this.endDate).format('YYYY/MM');
    if (open && this.endDate) {
      this.disabledStartDate = (current: Date): boolean => {
        return (
          differenceInCalendarMonths(current, new Date(YEAR_MONTH.start)) < 0 ||
          differenceInCalendarMonths(current, new Date(YEAR_MONTH.end)) > 0 ||
          (differenceInCalendarMonths(current, new Date(initEndDate)) > 0 ||
            differenceInCalendarYears(current, new Date(initEndDate)) > 0 ||
            differenceInCalendarYears(current, new Date(initEndDate)) < 0)
        );
      };
    } else if (open && !this.endDate) {
      // 禁用不在设定范围内的月份
      this.disabledStartDate = (current: Date): boolean => {
        return differenceInCalendarMonths(current, new Date(YEAR_MONTH.start)) < 0 || differenceInCalendarMonths(current, new Date(YEAR_MONTH.end)) > 0;
      };
    }
  }
  // 打开结束月份面板
  handleEndOpenChange(open: boolean): void {
    // 禁用当前月份之后、开始月份之前的所有月份
    const initStartDate = moment(this.startDate).format('YYYY/MM');
    if (open) {
      this.disabledEndDate = (current: Date): boolean => {
        return (
          differenceInCalendarMonths(current, new Date(YEAR_MONTH.start)) < 0 ||
          differenceInCalendarMonths(current, new Date(YEAR_MONTH.end)) > 0 ||
          differenceInCalendarMonths(current, new Date(initStartDate)) < 0 ||
          (differenceInCalendarYears(current, new Date(initStartDate)) < 0 || differenceInCalendarYears(current, new Date(initStartDate)) > 0)
        );
      };
    }
  }

  ngAfterViewInit() {
    this.mapComponent.ready
      .pipe(take(1))
      .toPromise()
      .then((map: any) => {
        this.clusterSrv.setMap(map);
        this.loadData();
      });
  }
  switch() {
    this.showBox = !this.showBox;
  }
  ngOnDestroy() {
    if (this.subject) {
      this.subject.unsubscribe();
    }
  }
}
