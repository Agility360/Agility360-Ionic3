import { FormControl } from '@angular/forms';
import { DEBUG_MODE } from '../shared/constants';

export class EmailValidator {

  static isValid(control: FormControl): any {
    if (DEBUG_MODE) console.log('EmailValidator.isValid()');

    if (control.value === "bademail") {
      return {
        "too short": true
      };
    }

    return null;
  }

  static checkEmailaddress(control: FormControl): any {
    if (DEBUG_MODE) console.log('EmailValidator.checkEmailaddress()');

    return new Promise(resolve => {

      //Fake a slow response from server

      setTimeout(() => {
        if (control.value.toLowerCase() === "lpm0073@gmail.com_") {

          resolve({
            "username taken": true
          });

        } else {
          resolve(null);
        }
      }, 500);

    });
  }
}
