import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { RouterModule } from '@angular/router';
import { PageComponent } from './page/page.component';


@NgModule({
  declarations: [
    PageComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
