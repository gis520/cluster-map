import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxAmapModule } from 'ngx-amap';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapApiLoadService } from './shared/services/map-api-loader.service';
import { VisualClusterService } from './visual-cluster/cluster.service';
import { VisualClusterModule } from './visual-cluster/visual-cluster.module';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

registerLocaleData(zh);
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    ToastrModule.forRoot({ timeOut: 3000, positionClass: 'toast-top-center' }),
    NgxAmapModule.forRoot({
      apiVersion: '1.4.14',
      apiKey: '146f101e824accd6956eeec4937c1a05' //'eb840ed80f669b89a8ff67602fddd5b1'
    }),
    VisualClusterModule
  ],
  providers: [MapApiLoadService, VisualClusterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
