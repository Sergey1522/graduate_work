import { TopArticleType } from './../../../../types/top.article.type';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ArticleService } from '../../services/article-service';
import { CommonModule } from '@angular/common';
import { Environments } from '../../../environments/environments';

@Component({
  selector: 'app-popular-articles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popular-articles.html',
  styleUrl: './popular-articles.css',
})
export class PopularArticles implements OnInit {
  private articleService = inject(ArticleService);
  urlImg = Environments.urlImg;
  public readonly topArticle = input.required<TopArticleType>();
  // topArticles = signal<TopArticleType[]>([]);

  ngOnInit(): void {
    // this.articleService.getTopArticle().subscribe({
    //   next: (data: TopArticleType[]) => {
    //     this.topArticles.set(data);
    //     console.log(data);
    //   },
    // });
  }
}
