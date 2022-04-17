import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import {TOSComponent} from './components/tos/tos.component';


const routes: Routes = [ { path: '', component: MainComponent }, {path: 'tos', component:TOSComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
