import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxAmapModule } from 'ngx-amap';
import { VisualClusterComponent } from './visual-cluster.component';
import { AMAP_API_KEY } from '../config/config';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [VisualClusterComponent, BarChartComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    NgxAmapModule.forRoot({
      apiVersion: '1.4.14',
      apiKey: AMAP_API_KEY
    })
  ],
  exports: [],
  providers: []
})
export class VisualClusterModule {}
