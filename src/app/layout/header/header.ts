import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { CartService, CartItem } from '../../core/services/cart';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {
  isMenuOpen = false;
  isLoginModalOpen = false;
  isCartModalOpen = false;
  showLoginForm = true;
  themeIconClass = 'fa-solid fa-sun';
  currentUser: any = null;
  cartItemCount = 0;
  cartItems: CartItem[] = [];
  isMarketplacePage = false;
  loginError: string | null = null;
  cartUpdateIndicator = false;
  private subscriptions = new Subscription();
  loginPasswordVisible = false;
  registerPasswordVisible = false;
  registerConfirmPasswordVisible = false;

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      lgpdConsent: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light-mode') {
      this.document.body.classList.add('light-mode');
      this.themeIconClass = 'fa-solid fa-moon';
    } else {
      this.document.body.classList.remove('light-mode');
      this.themeIconClass = 'fa-solid fa-sun';
    }

    this.subscriptions.add(this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    }));

    this.subscriptions.add(this.cartService.cartItems$.pipe(
      tap(() => this.triggerCartAnimation())
    ).subscribe(items => {
      this.cartItems = items;
      this.cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    }));

    this.subscriptions.add(
      this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        this.isMarketplacePage = event.urlAfterRedirects === '/marketplace';
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onLogin() {
    this.loginError = null;
    if (this.loginForm.valid) {
      if (this.authService.login(this.loginForm.value)) {
        this.closeLoginModal();
      } else {
        this.loginError = 'Usuário ou senha inválidos.';
      }
    }
  }

  // --- MÉTODO ATUALIZADO ---
  onRegister() {
    if (this.registerForm.valid) {
      const { confirmPassword, lgpdConsent, ...userData } = this.registerForm.value;
      
      if (this.authService.register(userData)) {
        // Se o registro foi bem-sucedido, faz o login automaticamente
        const loginCredentials = {
          username: userData.username,
          password: userData.password
        };
        if (this.authService.login(loginCredentials)) {
          // Se o login automático também foi bem-sucedido, fecha o modal
          this.closeLoginModal();
        }
      } else {
        // Se o registro falhou (usuário já existe), mostra um alerta
        alert('Usuário ou email já cadastrado!');
      }
      
      this.registerForm.reset();
    }
  }

  toggleLoginPasswordVisibility() {
    this.loginPasswordVisible = !this.loginPasswordVisible;
  }

  toggleRegisterPasswordVisibility() {
    this.registerPasswordVisible = !this.registerPasswordVisible;
  }

  toggleRegisterConfirmPasswordVisibility() {
    this.registerConfirmPasswordVisible = !this.registerConfirmPasswordVisible;
  }
  
  logout() { this.authService.logout(); }
  toggleMenu() { this.isMenuOpen = !this.isMenuOpen; }
  openLoginModal() { this.isLoginModalOpen = true; this.showLoginForm = true; this.loginError = null; }
  closeLoginModal() { this.isLoginModalOpen = false; }
  toggleForm() { this.showLoginForm = !this.showLoginForm; this.loginError = null; }
  openCartModal() { this.isCartModalOpen = true; }
  closeCartModal() { this.isCartModalOpen = false; }

  updateCartItemQuantity(productId: number, change: number) {
    this.cartService.updateQuantity(productId, change);
  }

  get cartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  checkout() {
    if(this.cartItems.length > 0) {
      alert('Compra finalizada com sucesso! (Simulação)');
      this.cartService.clearCart();
      this.closeCartModal();
    } else {
      alert('Seu carrinho está vazio!');
    }
  }

  triggerCartAnimation() {
    if (this.cartItemCount > 0) {
      this.cartUpdateIndicator = true;
      setTimeout(() => {
        this.cartUpdateIndicator = false;
      }, 500);
    }
  }

  toggleTheme() {
    this.document.body.classList.toggle('light-mode');
    if (this.document.body.classList.contains('light-mode')) {
      localStorage.setItem('theme', 'light-mode');
      this.themeIconClass = 'fa-solid fa-moon';
    } else {
      localStorage.setItem('theme', 'dark');
      this.themeIconClass = 'fa-solid fa-sun';
    }
  }
}