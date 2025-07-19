import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { CartService, CartItem } from '../../core/services/cart';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { NotificationService } from '../../core/services/notification';
import { AudioService } from '../../core/services/audio';

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
  isLogoutConfirmOpen = false;
  showLoginForm = true;
  themeIconClass = 'fa-solid fa-sun';
  currentUser: any = null;
  cartItemCount = 0;
  cartItems: CartItem[] = [];
  isMarketplacePage = false;
  loginError: string | null = null;
  cartUpdateIndicator = false;
  private subscriptions = new Subscription();
  loginForm: FormGroup;
  registerForm: FormGroup;
  loginPasswordVisible = false;
  registerPasswordVisible = false;
  registerConfirmPasswordVisible = false;
  isPlayingMusic = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router,
    private audioService: AudioService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
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

    const rememberedUser = this.authService.getRememberedUser();
    if (rememberedUser) {
      this.loginForm.patchValue({ username: rememberedUser, rememberMe: true });
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
    this.subscriptions.add(this.audioService.isPlaying$.subscribe(isPlaying => {
      this.isPlayingMusic = isPlaying;
    }));
  } // termino da musica

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
      const { rememberMe, ...credentials } = this.loginForm.value;
      if (!this.authService.login(credentials, rememberMe)) {
        this.loginError = 'Usuário ou senha inválidos.';
      } else {
        this.closeLoginModal();
      }
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { confirmPassword, lgpdConsent, ...userData } = this.registerForm.value;
      if (this.authService.register(userData)) {
        const loginCredentials = {
          username: userData.username,
          password: userData.password
        };
        if (this.authService.login(loginCredentials, false)) {
          this.closeLoginModal();
        }
      } else {
        this.notificationService.show('Usuário ou email já cadastrado!', 'error');
      }
    }
  }

  checkout() {
    if (this.currentUser) {
      if (this.cartItems.length > 0) {
        this.notificationService.show('Compra finalizada com sucesso!');
        this.cartService.clearCart();
        this.closeCartModal();
      } else {
        this.notificationService.show('Seu carrinho está vazio!', 'error');
      }
    } else {
      this.notificationService.show('Você precisa estar logado para finalizar a compra.', 'error');
      this.closeCartModal();
      this.openLoginModal();
    }
  }

  logout() {
    this.isLogoutConfirmOpen = true;
  }

  confirmLogout() {
    this.authService.logout();
    this.isLogoutConfirmOpen = false;
    this.notificationService.show('Você saiu com sucesso.');
  }
  toggleMenu() { this.isMenuOpen = !this.isMenuOpen; }
  openLoginModal() { this.isLoginModalOpen = true; this.showLoginForm = true; this.loginError = null; }
  closeLoginModal() { this.isLoginModalOpen = false; }
  toggleForm() { this.showLoginForm = !this.showLoginForm; this.loginError = null; }
  openCartModal() { this.isCartModalOpen = true; }
  closeCartModal() { this.isCartModalOpen = false; }
  closeLogoutConfirm() { this.isLogoutConfirmOpen = false; }

  updateCartItemQuantity(productId: number, change: number) {
    this.cartService.updateQuantity(productId, change);
  }

  get cartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
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

  toggleLoginPasswordVisibility() { this.loginPasswordVisible = !this.loginPasswordVisible; }
  toggleRegisterPasswordVisibility() { this.registerPasswordVisible = !this.registerPasswordVisible; }
  toggleRegisterConfirmPasswordVisibility() { this.registerConfirmPasswordVisible = !this.registerConfirmPasswordVisible; }
  toggleMusic() {
    this.audioService.togglePlayPause();
  }
}