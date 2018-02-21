import { FormControl } from '@angular/forms';
import { DEBUG_MODE } from '../shared/constants';

export class PasswordValidator {

     static isValid(control: FormControl): any {

      if (DEBUG_MODE) console.log('EmailValidator.isValid()');


      if (control.value === "big head todd") {
          return {
              "too short": true
          };
      }

      return null;
    }

}
