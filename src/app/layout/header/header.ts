import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { CartService, CartItem } from '../../core/services/cart';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

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
  themeIconClass = 'fa-solid fa-sun'; // <-- NOVA PROPRIEDADE PARA O ÍCONE
  private currentTheme = 'dark';
  currentUser: any = null;
  cartItemCount = 0;
  cartItems: CartItem[] = [];
  isMarketplacePage = false;
  private subscriptions = new Subscription();

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
      this.themeIconClass = 'fa-solid fa-moon'; // Define o ícone inicial correto
    } else {
      this.document.body.classList.remove('light-mode');
      this.themeIconClass = 'fa-solid fa-sun'; // Define o ícone inicial correto
    }

    this.subscriptions.add(this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    }));

    this.subscriptions.add(this.cartService.cartItems$.subscribe(items => {
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
    if (this.loginForm.valid) {
      if (this.authService.login(this.loginForm.value)) {
        this.closeLoginModal();
      }
      this.loginForm.reset();
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { confirmPassword, ...userData } = this.registerForm.value;
      if (this.authService.register(userData)) {
        this.toggleForm();
      }
      this.registerForm.reset();
    }
  }
  
  logout() { this.authService.logout(); }
  toggleMenu() { this.isMenuOpen = !this.isMenuOpen; }
  openLoginModal() { this.isLoginModalOpen = true; this.showLoginForm = true; }
  closeLoginModal() { this.isLoginModalOpen = false; }
  toggleForm() { this.showLoginForm = !this.showLoginForm; }
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

  toggleTheme() {
    this.document.body.classList.toggle('light-mode');

    if (this.document.body.classList.contains('light-mode')) {
      localStorage.setItem('theme', 'light-mode');
      this.themeIconClass = 'fa-solid fa-moon'; // Alterna para lua
    } else {
      localStorage.setItem('theme', 'dark');
      this.themeIconClass = 'fa-solid fa-sun'; // Alterna para sol
    }
  }
}