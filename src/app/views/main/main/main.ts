import { CommonModule } from '@angular/common';
import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { CarouselPromotion } from '../../../shared/components/carousel-promotion/carousel-promotion';
import { OurServices } from '../../../shared/components/our-services/our-services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { PopularArticles } from '../../../shared/components/popular-articles/popular-articles';
import { TopArticleType } from '../../../../types/top.article.type';
import { ArticleService } from '../../../shared/services/article-service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, OurServices, CarouselModule, PopularArticles, CarouselPromotion],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  private articleService = inject(ArticleService);
  topArticles = signal<TopArticleType[]>([]);
  receivedServices: any[] = [];

  onServicesLoaded(services: any[]) {
    this.receivedServices = services;
  }
  private fb = inject(FormBuilder);
  // ✅ Форма для попапа
  // popupForm: FormGroup = this.fb.group({
  //   keyword: [{ value: '', disabled: true }],
  //   name: ['', [Validators.required, Validators.minLength(2)]],
  //   phone: ['', [Validators.required, Validators.pattern(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/)]],
  //   comment: [''],
  // });

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 26,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
    },
    nav: false,
  };
  reviews = [
    {
      name: 'Станислав',
      image: './../../../assets/images/img-review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру. ',
    },
    {
      name: 'Алёна',
      image: './../../../assets/images/img-review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
    },
    {
      name: 'Мария',
      image: './../../../assets/images/img-review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
    },
    {
      name: 'Станислав',
      image: './../../../assets/images/img-review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру. ',
    },
  ];
  ngOnInit(): void {
    this.articleService.getTopArticle().subscribe({
      next: (data: TopArticleType[]) => {
        this.topArticles.set(data);
        console.log(data);
      },
    });
  }

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
  // submitPopup(): void {
  //   if (this.popupForm.valid) {
  //     console.log('✅ Форма отправлена:', this.popupForm.getRawValue());
  //     this.dialogRef?.close();
  //     this.popupForm.reset();
  //   } else {
  //     this.popupForm.markAllAsTouched();
  //   }
  // }

  // ✅ Закрытие попапа
  // closePopup(): void {
  //   this.dialogRef?.close();
  // }

  // ✅ Обновление при изменении слайда (опционально)
  onSlideChanged(event: any): void {
    console.log('Текущий слайд:', event);
  }
}
