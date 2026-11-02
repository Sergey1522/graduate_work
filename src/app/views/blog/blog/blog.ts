import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ArticleService } from '../../../shared/services/article-service';
import { TopArticleType } from '../../../../types/top.article.type';
import { CommonModule } from '@angular/common';
import { Environments } from '../../../environments/environments';
import { AllArticleType } from '../../../../types/all.article.type';
import { CategoryService } from '../../../shared/services/category-service';
import { CategoriesType } from '../../../../types/categories.type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog implements OnInit {
  private articleServices = inject(ArticleService);
  private categoryService = inject(CategoryService);
  private destroyRef = inject(DestroyRef);
  private readonly el = inject(ElementRef<HTMLElement>);
  allArticles = signal<TopArticleType[]>([]);
  urlImg = Environments.urlImg;
  openCategoryIndex = signal<number | null>(null);
  allCategories = signal<CategoriesType[]>([]);
  open = false;
  currentPage = signal<number>(1);
  // totalPages = signal<number>(1);
  private readonly serverPages = signal(1);
  readonly selectedCategoryNames = signal<Set<string>>(new Set());

  readonly activeFilters = computed(() =>
    [...this.selectedCategoryNames()].map((name) => ({
      key: `category-${name}`,
      name,
      type: 'category' as const,
      value: name,
    })),
  );
  readonly totalPages = computed(() =>
    this.selectedCategoryNames().size > 0 ? 1 : this.serverPages(),
  );
  readonly pagedArticles = computed(() => {
    return this.allArticles(); // без фильтра — сервер уже отдал нужную страницу
  });

  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  @ViewChild('sortingBody', { static: true })
  sortingBody!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.loadArticleServices();
  }
  loadArticleServices(): void {
    this.articleServices
      .getArticles({ page: this.currentPage() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.allArticles.set(data.items ?? []);
        this.serverPages.set(Math.max(1, data.pages ?? 1));
      });
  }

  TypeCategory(url: string): void {
    const next = new Set(this.selectedCategoryNames());
    next.has(url) ? next.delete(url) : next.add(url);
    this.selectedCategoryNames.set(next);
    this.currentPage.set(1);

    if (next.size === 0) {
      this.loadArticleServices(); // вернулись к обычной пагинации
    } else {
      this.loadAllForFilter(); // грузим всё, чтобы вместить на одну страницу
    }
  }
  private loadAllForFilter(): void {
    this.articleServices
      .getArticles({ page: 1 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        const selected = this.selectedCategoryNames();
        const all = (data.items ?? []).filter((a) => selected.has(a.category));
        this.allArticles.set(all);
        this.serverPages.set(1); // принудительно одна страница
      });
  }
  removeFilter(name: string): void {
    this.TypeCategory(name);
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;
    // если клик был внутри нашего компонента — не закрываем
    if (this.sortingBody?.nativeElement.contains(target)) return;
    this.openCategoryIndex.set(null);
  }
  toggleCategory(index: number): void {
    if (this.openCategoryIndex() === index) {
      this.openCategoryIndex.set(null);
    } else {
      this.openCategoryIndex.set(index);
      this.categoryService.getCategories().subscribe((data: CategoriesType[]) => {
        this.allCategories.set(data);
      });
    }
  }

  isSelected(name: string): boolean {
    return this.selectedCategoryNames().has(name);
  }

  goToPage(page: number): void {
    if (this.selectedCategoryNames().size > 0) return; // под фильтром листать нечего
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.currentPage.set(page);
    this.loadArticleServices();
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }
}
