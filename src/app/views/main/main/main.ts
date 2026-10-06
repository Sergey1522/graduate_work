import { PromoSlide } from './../../../../types/promo.type';
import { CommonModule } from '@angular/common';
import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { CarouselPromotion } from '../../../shared/components/carousel-promotion/carousel-promotion';
import { OurServices, Service } from '../../../shared/components/our-services/our-services';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { PopularArticles } from '../../../shared/components/popular-articles/popular-articles';
import { TopArticleType } from '../../../../types/top.article.type';
import { ArticleService } from '../../../shared/services/article-service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RequestsType } from '../../../../types/requests.type';
import { RequestsService } from '../../../shared/services/requests-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    OurServices,
    CarouselModule,
    PopularArticles,
    CarouselPromotion,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  private dialog = inject(MatDialog);
  private articleService = inject(ArticleService);
  private requestsService = inject(RequestsService);
  topArticles = signal<TopArticleType[]>([]);
  receivedServices: any[] = [];

  onServicesLoaded(services: any[]) {
    this.receivedServices = services;
  }

  private fb = inject(FormBuilder);
  popupForm: FormGroup = this.fb.group({
    type: ['service'],
    service: [{ value: '', disabled: true }],
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.pattern(/^[А-ЯЁ][а-яё]*$/)],
    ],
    phone: ['', [Validators.required, Validators.pattern(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/)]],
  });

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
  @ViewChild('order_service_modal') modalTemplate!: TemplateRef<any>;
  @ViewChild('order_success_modal') thankYouTemplate!: TemplateRef<any>;
  private dialogRef: MatDialogRef<any> | null = null;

  onOrderRequested(service: PromoSlide): void {
    this.popupForm.patchValue({
      service: service.keyword,
    });
    this.dialogRef = this.dialog.open(this.modalTemplate, {
      width: '800px',
      maxWidth: '95vw',
      panelClass: 'centered-modal',
      autoFocus: false,
      restoreFocus: false,
    });
  }
  onOrderServicesRequested(service: Service): void {
    this.popupForm.patchValue({
      service: service.name,
    });
    this.dialogRef = this.dialog.open(this.modalTemplate, {
      width: '800px',
      maxWidth: '95vw',
      panelClass: 'centered-modal',
      autoFocus: false,
      restoreFocus: false,
    });
  }
  private openSuccessModal(): void {
    this.dialogRef = this.dialog.open(this.thankYouTemplate, {
      width: '800px',
      maxWidth: '95vw',
      panelClass: 'centered-modal',
      autoFocus: false,
      disableClose: false,
    });
  }

  closeModal(): void {
    this.dialogRef?.close();
    this.popupForm.reset();
  }
  ngOnInit(): void {
    this.articleService.getTopArticle().subscribe({
      next: (data: TopArticleType[]) => {
        this.topArticles.set(data);
        console.log(data);
      },
    });
  }

  submitRequest(): void {
    if (this.popupForm.invalid) {
      this.popupForm.markAllAsTouched();
      return;
    }

    const requestData: RequestsType = {
      name: this.popupForm.value.name,
      phone: this.popupForm.value.phone,
      service: this.popupForm.getRawValue().service,
      type: 'order',
    };

    this.requestsService.createRequest(requestData).subscribe({
      next: (response) => {
        console.log(response);
        this.closeModal();
        this.openSuccessModal();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
