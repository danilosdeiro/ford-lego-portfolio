import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  contactForm: FormGroup;
  isLgpdModalOpen = false;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      lgpdConsent: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.notificationService.show('Mensagem enviada com sucesso!');
      this.contactForm.reset();
    } else {
      this.notificationService.show('Por favor, preencha todos os campos corretamente.', 'error');
    }
  }

  openLgpdModal() {
    this.isLgpdModalOpen = true;
  }
  closeLgpdModal() {
    this.isLgpdModalOpen = false;
  }
}