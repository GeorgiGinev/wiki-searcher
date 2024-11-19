import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { PageComponent } from './page/page.component';
import {ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { provideHttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    PageComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    CommonModule,
    GameRoutingModule,
  ],
  providers: [
    provideHttpClient()
  ]
})
export class GameModule { }
