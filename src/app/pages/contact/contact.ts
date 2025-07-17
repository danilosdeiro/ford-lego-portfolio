import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule], // Importe o ReactiveFormsModule para usar as diretivas no HTML
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  private fb = inject(FormBuilder); // Injeta o FormBuilder de forma moderna

  contactForm: FormGroup;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      lgpdConsent: [false, Validators.requiredTrue] // O valor inicial é 'false' e é obrigatório que seja 'true' para ser válido
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      // Formulário válido
      console.log('Dados do Formulário:', this.contactForm.value);
      alert('Mensagem enviada com sucesso! (Simulação)');
      this.contactForm.reset();
    } else {
      // Formulário inválido
      alert('Por favor, preencha todos os campos corretamente e aceite os termos.');
    }
  }
}