import { ViewportScroller } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
  constructor(private viewportScroller: ViewportScroller) {
    // Устанавливаем отступ: [по горизонтали, по вертикали]
    // 200px — это высота вашего хедера
    this.viewportScroller.setOffset([0, 130]);
  }
}
