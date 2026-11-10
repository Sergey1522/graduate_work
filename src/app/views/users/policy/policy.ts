import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './policy.html',
  styleUrl: './policy.css',
})
export class Policy {}
