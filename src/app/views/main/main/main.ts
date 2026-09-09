import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselPromotion } from '../../../shared/components/carousel-promotion/carousel-promotion';
import { OurServices } from '../../../shared/components/our-services/our-services';

@Component({
  selector: 'app-main',
  imports: [CommonModule, CarouselPromotion, OurServices],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  receivedServices: any[] = [];
  onServicesLoaded(services: any[]) {
    this.receivedServices = services;
  }
}
