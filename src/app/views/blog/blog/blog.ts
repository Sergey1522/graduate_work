import { Component, inject, OnInit, signal } from '@angular/core';
import { ArticleService } from '../../../shared/services/article-service';
import { TopArticleType } from '../../../../types/top.article.type';
import { CommonModule } from '@angular/common';
import { Environments } from '../../../environments/environments';
import { AllArticleType } from '../../../../types/all.article.type';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog implements OnInit {
  private articleServices = inject(ArticleService);
  allArticles = signal<TopArticleType[]>([]);
  urlImg = Environments.urlImg;
  ngOnInit(): void {
    this.articleServices.getArticles().subscribe((data: AllArticleType) => {
      this.allArticles.set(data.items || []);
      console.log(data);
    });
  }
}
