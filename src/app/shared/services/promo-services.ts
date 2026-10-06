import { Injectable, signal } from '@angular/core';
import { PromoSlide } from '../../../types/promo.type';

@Injectable({
  providedIn: 'root',
})
export class PromoServices {
  private slides = signal<PromoSlide[]>([
    {
      id: 1,
      label: 'Предложение месяца',
      title: 'Продвижение в Instagram для вашего бизнеса',
      accent: '-15%!',
      buttonText: 'Подробнее',
      image: '/assets/images/banner-1.png',
      keyword: 'Instagram',
    },
    {
      id: 2,
      label: 'Новинка сезона',
      title: 'Нужен грамотный копирайтер?',
      text: 'Весь декабрь у нас действует акция на работу копирайтера.',
      accent: '-20%!',
      buttonText: 'Подробнее',
      image: 'assets/images/banner-2.png',
      keyword: 'Сайт',
    },
    {
      id: 3,
      label: 'Специальное предложение',
      title: 'SEO-продвижение вашего сайта в топ поисковых систем',
      text: 'Мы благодарим каждого, кто голосовал за нас!',
      accent: '-25%!',
      buttonText: 'Подробнее',
      image: 'assets/images/banner-3.png',
      keyword: 'SEO',
    },
  ]);

  getSlides() {
    return this.slides;
  }
}
