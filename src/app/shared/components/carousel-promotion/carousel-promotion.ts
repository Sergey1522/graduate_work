import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
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
  private fb = inject(FormBuilder);
  private promoService = inject(PromoServices);

  slides = this.promoService.getSlides();
  currentIndex = signal(0);

  // ✅ Автопрокрутка
  private autoPlayInterval: any;

  ngOnInit(): void {
    // this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  // ✅ Следующий слайд
  next(): void {
    this.currentIndex.update((i) => (i + 1) % this.slides().length);
  }

  // ✅ Предыдущий слайд
  prev(): void {
    this.currentIndex.update((i) => (i - 1 + this.slides().length) % this.slides().length);
  }

  // ✅ Переход на конкретный слайд
  goTo(index: number): void {
    this.currentIndex.set(index);
    this.restartAutoPlay();
  }

  // ✅ Автопрокрутка
  // private startAutoPlay(): void {
  //   this.autoPlayInterval = setInterval(() => this.next(), 5000);
  // }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  private restartAutoPlay(): void {
    this.stopAutoPlay();
    // this.startAutoPlay();
  }

  // ✅ Пауза при наведении
  onMouseEnter(): void {
    this.stopAutoPlay();
  }

  // onMouseLeave(): void {
  //   this.startAutoPlay();
  // }

  // ✅ Действие при клике на кнопку
  onButtonClick(slide: PromoSlide): void {
    console.log('Открыть попап для:', slide.keyword);
    // Здесь открываете попап или переходите на страницу
  }

  // ✅ Форма для попапа
  popupForm: FormGroup = this.fb.group({
    keyword: [{ value: '', disabled: true }],
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/)]],
    comment: [''],
  });

  @ViewChild('popupTemplate') popupTemplate!: TemplateRef<any>;
  private dialogRef: any = null;

  // ✅ Открытие попапа
  // openPopup(item: any): void {
  //   this.popupForm.patchValue({ keyword: item.keyword });

  //   this.dialogRef = this.dialog.open(this.popupTemplate, {
  //     width: '500px',
  //     data: { item },
  //     disableClose: true,
  //     panelClass: 'custom-dialog-container'
  //   });
  // }

  // ✅ Отправка формы
  submitPopup(): void {
    if (this.popupForm.valid) {
      console.log('✅ Форма отправлена:', this.popupForm.getRawValue());
      this.dialogRef?.close();
      this.popupForm.reset();
    } else {
      this.popupForm.markAllAsTouched();
    }
  }

  // ✅ Закрытие попапа
  closePopup(): void {
    this.dialogRef?.close();
  }

  // ✅ Обновление при изменении слайда (опционально)
  onSlideChanged(event: any): void {
    console.log('Текущий слайд:', event);
  }
}
