import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidators {

  // whitespace validation
  static notOnlyWhiteSpace(control: FormControl) : ValidationErrors {

    // check if sting has ony white space
    if ((control.value != null) && (control.value.trim().length === 0)) {

      // invalid, return error object
      return { 'notOnlyWhiteSpace' : true };

    }
    else {
      return null;
    }
  }
}
