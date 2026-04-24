import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './layout/layout.module';

@NgModule({
  imports: [BrowserModule, AppRoutingModule, LayoutModule],
})
export class AppModule {}
