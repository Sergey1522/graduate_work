import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthServices } from '../../../core/auth/auth-services';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { DefaultResponseType } from '../../../../types/default.response.type';
import { LoginResponseType } from '../../../../types/login.response.type';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterLink, NgStyle, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthServices);
  private fb = inject(FormBuilder);
  private _snackbar = inject(MatSnackBar);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService
        .login(
          this.loginForm.value.email,
          this.loginForm.value.password,
          this.loginForm.value.rememberMe,
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
              error = 'Ошибка авторизации';
            }
            if (error) {
              this._snackbar.open(error);
              throw new Error(error);
            }
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;

            this._snackbar.open('Вы успешно авторизовались', '', {
              duration: 3000,
            });
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackbar.open(errorResponse.error.message);
            } else {
              this._snackbar.open('Ошибка авторизации', '', {
                duration: 3000,
              });
            }
          },
        });
    }
  }
}
