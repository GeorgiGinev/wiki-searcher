import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Injectable()
export class CustomFormService {

  constructor() { }

  /**
   * Check if in the form group all fields are valid
   * @param formGroup form group object
   * @returns
   */
  public isFormValid(formGroup: FormGroup | undefined): boolean {
    if(!formGroup) {
      return false;
    }

    let validate: boolean = true;

    Object.keys(formGroup.controls).forEach((key: string) => {
      const control: AbstractControl | null = formGroup.get(key);
      if(!control?.valid) {
        validate = false;
        return;
      }
    })

    console.log('validate : ', validate);
    return validate;
  }
}
