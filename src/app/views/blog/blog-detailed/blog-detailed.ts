import { CommonModule, NgStyle } from '@angular/common';
import { Component, DestroyRef, inject, NgModule, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArticleService } from '../../../shared/services/article-service';
import { TopArticleType } from '../../../../types/top.article.type';
import { DetailedArticleType } from '../../../../types/detailed.article.type';
import { Environments } from '../../../environments/environments';
import { AllArticleType } from '../../../../types/all.article.type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DetailedArticleCommentsType } from '../../../../types/detailed.article.comments.type';
import { CommentType } from '../../../../types/comment.type';

@Component({
  selector: 'app-blog-detailed',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, NgStyle],
  templateUrl: './blog-detailed.html',
  styleUrl: './blog-detailed.css',
})
export class BlogDetailed implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private articleService = inject(ArticleService);
  private destroyRef = inject(DestroyRef);
  detailInfo = signal<DetailedArticleType | null>(null);
  readonly topArticle = signal<TopArticleType[]>([]);

  readonly commentsCount = signal(0);
  readonly comments = signal<CommentType[]>([]);
  urlImg = Environments.urlImg;
  breadcrumb = signal<string>('');
  readonly commentText = signal('');
  readonly submitting = signal(false);
  readonly commentControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.articleService
        .getDetiledArticle(params['url'])
        .subscribe((data: DetailedArticleType) => {
          this.detailInfo.set(data);
          this.breadcrumb.set(data.title);
          this.loadRelated(data.url);
          this.loadComments();
        });
    });
  }

  private loadRelated(url: string): void {
    this.articleService.getDetiledRelatedArticle(url).subscribe({
      next: (data) => {
        this.topArticle.set(data ?? []);
        console.log(data);
      },

      error: (err) => console.error('Ошибка загрузки похожих статей', err),
    });
  }

  // Comments

  onSubmitComment(event: Event): void {
    event.preventDefault();
    const text = this.commentControl.value.trim();
    const articleId = this.detailInfo()?.id;
    if (!text || !articleId || this.commentControl.invalid) return;

    this.submitting.set(true);
    this.articleService
      .addComment(articleId, text)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (comment) => {
          const current = this.detailInfo();
          console.log(comment);
          // if (current) {
          //   this.detailInfo.set({
          //     ...current,
          //     comments: [...(current.comments ?? []), comment],
          //     commentsCount: (current.commentsCount ?? 0) + 1,
          //   });
          // }
          this.loadComments();
          this.commentControl.reset();
          this.submitting.set(false);
        },
        error: (err) => {
          console.error('Ошибка отправки', err);
          this.submitting.set(false);
        },
      });
  }
  private loadComments(): void {
    const articleId = this.detailInfo()?.id;
    if (!articleId) return;

    this.articleService
      .getComments(articleId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          console.log(data);
          this.comments.set(data.comments ?? []);
          this.commentsCount.set(data.allCount ?? 0);
        },
        error: (err) => console.error('Ошибка загрузки комментариев', err),
      });
  }

  // like(comment: DetailedArticleType, value: 1 | 0): void {
  //   const articleId = this.detailInfo()?.id;
  //   if (!articleId) return;

  //   this.articleService
  //     .reactToComment(articleId, comment.id, value)
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe((updated) => {
  //       const current = this.detailInfo();
  //       if (!current?.comments) return;
  //       this.detailInfo.set({
  //         ...current,
  //         comments: current.comments.map((c) => (c.id === updated.id ? updated : c)),
  //       });
  //     });
  // }

  replyTo(comment: CommentType): void {
    // например, фокус на textarea + префикс @name
    this.commentText.set(`@${comment.text}, `);
  }
}
