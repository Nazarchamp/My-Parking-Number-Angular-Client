import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { MapComponentComponent } from './components/map-component/map-component.component';
import { DropdownInfoComponent } from './components/dropdown-info/dropdown-info.component';
import {AngularFittextModule} from 'angular-fittext';
import { TOSComponent } from './components/tos/tos.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MapComponentComponent,
    DropdownInfoComponent,
    TOSComponent
  ],
  imports: [
    AngularFittextModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
