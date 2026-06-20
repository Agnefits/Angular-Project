import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appDark]',
  standalone: true,
})
export class Dark {
  @Input() appDark = false;
  @HostBinding('class.bg-dark') get ActiveDark(){
    return this.appDark;

  }
  constructor(){}


}
