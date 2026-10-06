import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthServices } from '../../../core/auth/auth-services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  private authService = inject(AuthServices);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  isLogged = signal<boolean>(false);
  userName = signal<string>('');
  isMenuOpen = signal<boolean>(false);
  ngOnInit(): void {
    this.isLogged.set(this.authService.getIsLoggedIn());
    if (this.isLogged()) {
      this.userName.set(this.authService.getUserName());
    }
    this.authService.isLogged$.subscribe((status) => {
      this.isLogged.set(status);
      if (status) {
        this.userName.set(this.authService.getUserName());
      } else {
        this.userName.set('');
      }
    });
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
}
