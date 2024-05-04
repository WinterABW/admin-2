import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getRoles'
})
export class GetRolesPipe implements PipeTransform {

  transform(value: any[]): any {
    return value.map(g => g.name);
  }

}
