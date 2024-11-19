import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WikiSearcherService } from './services/wiki-searcher/wiki-searcher.service';
import { CustomFormService } from './services/custom-form/custom-form.service';



@NgModule({
  declarations: [],
  providers: [
    WikiSearcherService,
    CustomFormService
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
