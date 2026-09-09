import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-our-services',
  imports: [CommonModule],
  templateUrl: './our-services.html',
  styleUrl: './our-services.css',
})
export class OurServices implements OnInit {
  services = [
    {
      image: './../../../assets/images/service-1.png',
      name: 'Создание сайтов',
      text: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса! ',
      price: '7 500₽',
    },
    {
      name: 'Продвижение',
      image: './../../../assets/images/service-2.png',
      text: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне! ',
      price: '3 500₽',
    },
    {
      name: 'Реклама',
      image: '/assets/images/service-3.png',
      text: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы. ',
      price: '1 000₽',
    },
    {
      name: 'Копирайтинг',
      image: './../../../assets/images/service-4.png',
      text: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах. ',
      price: '750₽',
    },
  ];

  @Output() servicesLoaded = new EventEmitter<any[]>();

  ngOnInit(): void {
    this.servicesLoaded.emit(this.services);
  }
}
