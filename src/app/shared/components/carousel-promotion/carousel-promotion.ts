import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Output,
  signal,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PromoSlide } from '../../../../types/promo.type';
import { PromoServices } from '../../services/promo-services';

@Component({
  selector: 'app-carousel-promotion',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './carousel-promotion.html',
  styleUrl: './carousel-promotion.css',
  encapsulation: ViewEncapsulation.None,
})
export class CarouselPromotion {
  private promoService = inject(PromoServices);
  @Output() orderRequested = new EventEmitter<PromoSlide>();
  slides = this.promoService.getSlides();
  currentIndex = signal(0);

  ngOnInit(): void {}

  onDetailsClick(service: PromoSlide): void {
    this.orderRequested.emit(service);
  }

  next(): void {
    this.currentIndex.update((i) => (i + 1) % this.slides().length);
  }

  prev(): void {
    this.currentIndex.update((i) => (i - 1 + this.slides().length) % this.slides().length);
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
  }

  @ViewChild('popupTemplate') popupTemplate!: TemplateRef<any>;
  private dialogRef: any = null;

  closePopup(): void {
    this.dialogRef?.close();
  }

  onSlideChanged(event: any): void {
    console.log('Текущий слайд:', event);
  }
}
