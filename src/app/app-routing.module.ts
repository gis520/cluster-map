import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisualClusterComponent } from './visual-cluster/visual-cluster.component';


const routes: Routes = [{
  path: '', component: VisualClusterComponent,
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
