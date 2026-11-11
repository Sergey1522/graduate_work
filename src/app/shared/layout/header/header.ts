import { Component, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthServices } from '../../../core/auth/auth-services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { UserType } from '../../../../types/user.type';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  private authService = inject(AuthServices);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  readonly isScrolled = signal(false);
  isLogged = signal<boolean>(false);
  userName = signal<string | null>('');
  isMenuOpen = signal<boolean>(false);
  ngOnInit(): void {
    this.isLogged.set(this.authService.getIsLoggedIn());
    if (this.isLogged()) {
      this.loadUserProfile();
    }
    this.authService.isLogged$.subscribe((status) => {
      this.isLogged.set(status);
      if (status) {
        this.loadUserProfile();
      } else {
        this.userName.set('');
      }
    });
  }
  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 10);
  }
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger | undefined;

  someMethod() {
    if (this.trigger) {
      this.trigger.openMenu();
    }
  }
  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen.update((open) => !open);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.removeTokens();
        this.authService.userId = null;
        this.isMenuOpen.set(false);
        this.snackBar.open('Вы вышли из системы', 'Закрыть', { duration: 3000 });
        this.router.navigate(['/']);
      },
      error: () => {
        this.authService.removeTokens();
        this.router.navigate(['/']);
      },
    });
  }
  private loadUserProfile(): void {
    this.authService.getUserProfile().subscribe({
      next: (user: UserType) => {
        this.userName.set(user.name);
        localStorage.setItem('userName', user.name);
      },
      error: (err) => {
        if (err.status === 401) {
          this.authService.logout();
        }
      },
    });
  }
}
