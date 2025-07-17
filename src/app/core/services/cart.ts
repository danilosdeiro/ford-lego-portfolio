import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  imgCar: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  constructor() { }

  addToCart(product: Product, quantity: number) {
    const currentItems = this.cartItems.getValue();
    const existingItem = currentItems.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }
    this.cartItems.next([...currentItems]);
    alert(`${quantity}x ${product.name} adicionado(s) ao carrinho!`);
  }

  updateQuantity(productId: number, change: number) {
    const currentItems = this.cartItems.getValue();
    const item = currentItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.cartItems.next([...currentItems]);
      }
    }
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.getValue().filter(item => item.product.id !== productId);
    this.cartItems.next(currentItems);
  }

  clearCart() {
    this.cartItems.next([]);
  }
}