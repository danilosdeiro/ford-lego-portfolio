import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Product } from '../../core/services/cart';

export interface MarketplaceProduct extends Product {
  imgBox: string;
  pieceCount: number;
}

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marketplace.html',
  styleUrl: './marketplace.css'
})
export class Marketplace {
  products: MarketplaceProduct[] = [
    {
      id: 1, name: 'Mustang GT', price: 899.99,
      pieceCount: 1471,
      imgCar: 'assets/images/mustangmp.png',
      imgBox: 'assets/images/mustangbox.png'
    },
    {
      id: 2, name: 'Ranger Raptor', price: 799.99,
      pieceCount: 1379,
      imgCar: 'assets/images/raptormp.jpeg',
      imgBox: 'assets/images/raptorbox.jpg'
    },
    {
      id: 3, name: 'Bronco Sport', price: 699.99,
      pieceCount: 1263,
      imgCar: 'assets/images/broncomp.png',
      imgBox: 'assets/images/broncobox.png'
    },
    {
      id: 4, name: 'Ford GT 2022', price: 999.99,
      pieceCount: 1466,
      imgCar: 'assets/images/fordgtmp.png',
      imgBox: 'assets/images/fordgtbox.jpg'
    },
    {
      id: 5, name: 'Ford Pilots', price: 79.99,
      pieceCount: 4,
      imgCar: 'assets/images/personagens.jpg',
      imgBox: 'assets/images/personagensbox.jpg'
    },
        {
      id: 6, name: 'Ford Ka Classic', price: 479.99,
      pieceCount: 293,
      imgCar: 'assets/images/fordkamp.png',
      imgBox: 'assets/images/fordkabox.png'
    }
  ];

  quantities: { [productId: number]: number } = {};

  constructor(private cartService: CartService) {
    this.products.forEach(p => this.quantities[p.id] = 1);
  }

  addToCart(product: Product) {
    const quantity = this.quantities[product.id];
    if (quantity > 0) {
      this.cartService.addToCart(product, quantity);
    } else {
      alert('Por favor, insira uma quantidade válida.');
    }
  }

  changeQuantity(productId: number, change: number) {
    const currentQuantity = this.quantities[productId];
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      this.quantities = {
        ...this.quantities,
        [productId]: newQuantity
      };
    }
  }
}