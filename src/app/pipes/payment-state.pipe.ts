import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'paymentState'
})
export class PaymentStatePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    switch (value) {
      case 'Pending': {
        return 'Pendiente';
      }
      case 'aceptada': {
        return 'Aceptada';
      }
    }
    return 'Sin estado';
  }

}
