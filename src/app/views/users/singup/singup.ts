import { NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-singup',
  imports: [RouterLink, ReactiveFormsModule, NgStyle],
  templateUrl: './singup.html',
  styleUrl: './singup.css',
})
export class Singup {
  private fb = inject(FormBuilder);

  signUpForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[А-ЯЁ][а-яё]*(?:\s+[А-ЯЁ][а-яё]*)*$/)]],
    email: ['', [Validators.email, Validators.required]],
    password: [
      '',
      [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)],
    ],
    accept: [false, [Validators.requiredTrue]],
  });
}
