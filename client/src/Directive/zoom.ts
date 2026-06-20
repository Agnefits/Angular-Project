import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appZoom]',
  standalone: true,
})
export class Zoom {
  constructor(private element: ElementRef){}
  @HostListener('mouseover') zoomin(){
    this.element.nativeElement.style.transform = 'scale(1.2)';
    this.element.nativeElement.style.transition = '0.5s ease';
  }
  @HostListener('mouseleave') zoomout(){
    this.element.nativeElement.style.transform = 'scale(1)'
  }
}
