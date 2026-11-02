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
      accent: '-15%',
      sign: '!',
      buttonText: 'Подробнее',
      image: '/assets/images/banner-1.png',
      keyword: 'Instagram',
    },
    {
      id: 2,
      label: 'Акция',
      title: 'Нужен грамотный',
      text: 'Весь декабрь у нас действует акция на работу копирайтера.',
      accent: 'копирайтер',
      sign: '?',
      buttonText: 'Подробнее',
      image: 'assets/images/banner-2.png',
      keyword: 'Сайт',
    },
    {
      id: 3,
      label: 'Новость дня',
      title1: '6 место',
      title: ' в ТОП-10 SMM-агенств Москвы!',
      text: 'Мы благодарим каждого, кто голосовал за нас!',
      accent: '',
      sign: '',
      buttonText: 'Подробнее',
      image: 'assets/images/banner-3.png',
      keyword: 'SEO',
    },
  ]);

  getSlides() {
    return this.slides;
  }
}
