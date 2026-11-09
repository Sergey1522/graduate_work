import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArticleService } from '../../../shared/services/article-service';
import { TopArticleType } from '../../../../types/top.article.type';
import { DetailedArticleType } from '../../../../types/detailed.article.type';
import { Environments } from '../../../environments/environments';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentType } from '../../../../types/comment.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthServices } from '../../../core/auth/auth-services';

@Component({
  selector: 'app-blog-detailed',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './blog-detailed.html',
  styleUrl: './blog-detailed.css',
})
export class BlogDetailed implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private articleService = inject(ArticleService);
  private authServices = inject(AuthServices);
  private destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(MatSnackBar);
  private router = inject(Router);
  detailInfo = signal<DetailedArticleType | null>(null);
  readonly topArticle = signal<TopArticleType[]>([]);
  readonly commentsCount = signal(0);
  readonly comments = signal<CommentType[]>([]);
  urlImg = Environments.urlImg;
  breadcrumb = signal<string>('');
  readonly submitting = signal(false);
  readonly commentsForbidden = signal(false);
  readonly commentControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  readonly isLoggedIn = computed(() => !!this.authServices.getTokens()?.accessToken);
  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const url = params.get('url');
      if (!url) return;

      this.articleService
        .getDetiledArticle(url)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data) => {
            this.detailInfo.set(data);
            this.breadcrumb.set(data.title);
            this.loadRelated(data.url);
            this.loadComments();
          },
          error: (err) => console.error('Ошибка загрузки статьи', err),
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
        next: () => {
          this.loadComments();
          this.commentControl.reset();
          this.submitting.set(false);
        },
        error: (err) => {
          console.error('Ошибка отправки', err);
          this.submitting.set(false);
          if (err.status === 401) {
            this.snackBar
              .open('Вы не авторизованы. Войдите, чтобы оставить комментарий.', 'Войти', {
                duration: 5000,
              })
              .onAction()
              .subscribe(() => this.router.navigate(['/login']));
          } else {
            this.snackBar.open('Не удалось отправить комментарий', 'OK', { duration: 3000 });
          }
        },
      });
  }
  private loadComments(): void {
    if (!this.authServices.getIsLoggedIn()) return;
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
          this.commentsForbidden.set(false);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Ошибка загрузки комментариев', err);
          if (err.status === 401 || err.status === 403) {
            this.commentsForbidden.set(true);
          }
        },
      });
  }
  like(comment: CommentType, action: 'like' | 'dislike'): void {
    const articleId = this.detailInfo()?.id;
    if (!articleId) return;

    this.articleService
      .applyCommentAction(comment.id, action)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadComments();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Ошибка реакции', err);
          if (err.status === 401) {
            this.snackBar.open('Войдите, чтобы оценивать комментарии.', 'Войти', {
              duration: 5000,
            });
          }
        },
      });
  }
}
