import { NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthServices } from '../../../core/auth/auth-services';
import { DefaultResponseType } from '../../../../types/default.response.type';
import { LoginResponseType } from '../../../../types/login.response.type';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-singup',
  imports: [RouterLink, ReactiveFormsModule, NgStyle],
  templateUrl: './singup.html',
  styleUrl: './singup.css',
})
export class Singup {
  private authService = inject(AuthServices);
  private fb = inject(FormBuilder);
  private _snackbar = inject(MatSnackBar);
  private router = inject(Router);

  signUpForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[А-ЯЁ][а-яё]*(?:\s+[А-ЯЁ][а-яё]*)*$/)]],
    email: ['', [Validators.email, Validators.required]],
    password: [
      '',
      [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)],
    ],
    accept: [false, [Validators.requiredTrue]],
  });

  signup(): void {
    if (
      this.signUpForm.valid &&
      this.signUpForm.value.name &&
      this.signUpForm.value.email &&
      this.signUpForm.value.password &&
      this.signUpForm.value.accept
    ) {
      this.authService
        .signup(
          this.signUpForm.value.name,
          this.signUpForm.value.email,
          this.signUpForm.value.password,
        )
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }
            const loginResponse = data as LoginResponseType;
            if (
              !loginResponse.accessToken ||
              !loginResponse.refreshToken ||
              !loginResponse.userId
            ) {
              error = 'Ошибка регистрации';
            }
            if (error) {
              this._snackbar.open(error);
              throw new Error(error);
            }
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
             // ✅ Сохраняем имя пользователя
            localStorage.setItem('userName', this.signUpForm.value.name);

            // ✅ Уведомляем Header об изменении
            this.authService.isLogged$.next(true);

            this._snackbar.open('Вы успешно зарегистрировались', '', { duration: 3000 });
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackbar.open(errorResponse.error.message);
            } else {
              this._snackbar.open('Ошибка регистрации', '', { duration: 3000 });
            }
          },
        });
    }
  }
}
