import { Component, EventEmitter, OnInit, Output, AfterViewInit } from '@angular/core';
import * as G2 from '@antv/g2';
import { Subscription } from 'rxjs';
import { VisualClusterService } from '../cluster.service';
import * as _ from 'lodash';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit, AfterViewInit {
  @Output() switch = new EventEmitter();
  chartData: any;
  tabTitle = ['全国订单量', '按月统计'];
  data = [];
  sortData: any[] = [];
  chart: any;
  subject: Subscription;
  provincesData: any; // 省份数据
  selectedIndex = 0;
  constructor(private clusterSrv: VisualClusterService) {}
  ngOnInit() {
    const clientHeight = document.documentElement.clientHeight / 2 - 60 - 10;
    const clientWidth = document.documentElement.clientWidth * 0.85;
    this.chart = new G2.Chart({
      container: 'chart', // 指定图表容器 ID
      width: clientWidth, // 指定图表宽度
      height: clientHeight // 指定图表高度
    });

    this.subject = this.clusterSrv._subject$.subscribe((res = []) => {
      this.selectedIndex = 0;
      this.chartData = this.provincesData = res;
      this.barChartData();
    });
  }

  sortFun() {
    const cloneChartData = _.cloneDeep(this.chartData);
    this.sortData = cloneChartData
      .sort((max: any, min: any) => {
        // 倒序取前八名
        return min.number - max.number;
      })
      .slice(0, 8);
  }
  // 载入数据源
  barChartData() {
    // 创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
    //  渲染图表
    this.chart.source([...this.chartData], {
      number: {
        alias: '订单量'
      }
    });
    this.chart
      .interval()
      .position('name*number')
      .opacity(1)
      .opacity(1)
      .label('number');
    // .color('genre');
    this.chart.render();
    this.sortFun(); //排序
  }
  clickTab(event) {
    this.selectedIndex = event.index;
    if (event.index === 0) {
      this.chartData = this.provincesData;
    } else {
      const arr = this.clusterSrv.monthsNumber.sort((a, b) => (a.name > b.name ? 1 : -1));
      this.chartData = arr;
    }
    this.barChartData();
  }
  ngAfterViewInit() {
    if (this.subject && this.chartData) {
      this.subject.unsubscribe();
    }
  }
}
