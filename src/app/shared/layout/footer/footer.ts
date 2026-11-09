import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { RequestsType } from '../../../../types/requests.type';
import { RequestsService } from '../../services/requests-service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private requestsService = inject(RequestsService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  popupForm: FormGroup = this.fb.group({
    type: ['service'],
    service: [{ value: 'Фриланс', disabled: true }],
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.pattern(/^[А-ЯЁа-яё\s\-']{2,}$/)],
    ],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{10,}$/)]],
  });
  @ViewChild('order_service_modal') modalTemplate!: TemplateRef<any>;
  @ViewChild('order_success_modal') thankYouTemplate!: TemplateRef<any>;
  private dialogRef: MatDialogRef<any> | null = null;

  onOrderRequested(): void {
    this.dialogRef = this.dialog.open(this.modalTemplate, {
      width: '800px',
      maxWidth: '95vw',
      panelClass: 'centered-modal',
      autoFocus: false,
      restoreFocus: false,
    });
  }
  private openSuccessModal(): void {
    this.dialogRef = this.dialog.open(this.thankYouTemplate, {
      width: '800px',
      maxWidth: '95vw',
      panelClass: 'centered-modal',
      autoFocus: false,
      disableClose: false,
    });
  }
  submitRequest(): void {
    if (this.popupForm.invalid) {
      this.popupForm.markAllAsTouched();
      return;
    }

    const requestData: RequestsType = {
      name: this.popupForm.value.name,
      phone: this.popupForm.value.phone,
      service: this.popupForm.getRawValue().service,
      type: 'order',
    };

    this.requestsService.createRequest(requestData).subscribe({
      next: (response) => {
        console.log(response);
        this.closeModal();
        this.openSuccessModal();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  closeModal(): void {
    this.dialogRef?.close();
    this.popupForm.reset();
  }
  inputError(name: string): boolean {
    const control = this.popupForm.get(name);
    return !!control?.invalid && (!!control?.dirty || !!control?.touched);
  }
}
