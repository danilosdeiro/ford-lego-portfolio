import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Product } from '../../core/services/cart';

export interface MarketplaceProduct extends Product {
  imgBox: string;
  pieceCount: number; // Opcional, se quiser exibir a contagem de peças
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
      pieceCount: 1471, // Exemplo de contagem de peças
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
    { id: 4, name: 'Ford GT 2022', price: 999.99,
      pieceCount: 1466,
      imgCar: 'assets/images/fordgtmp.png',
      imgBox: 'assets/images/fordgtbox.jpg'
    },
      { id: 5, name: 'Ford Pilots', price: 79.99,
      pieceCount: 4,
      imgCar: 'assets/images/personagens.jpg',
      imgBox: 'assets/images/personagensbox.jpg'
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

  // --- MÉTODO ATUALIZADO ---
changeQuantity(productId: number, change: number) {
  // Detetive 1: A função foi chamada corretamente?
  console.log(`--- Iniciando changeQuantity para o produto ${productId}, com alteração de ${change} ---`);

  const currentQuantity = this.quantities[productId];
  // Detetive 2: Qual era a quantidade antes do clique?
  console.log('Quantidade atual no objeto de dados:', currentQuantity);

  const newQuantity = currentQuantity + change;
  // Detetive 3: Qual é a nova quantidade calculada?
  console.log('Nova quantidade calculada:', newQuantity);

  if (newQuantity >= 1) {
    // Detetive 4: Entramos na condição para atualizar?
    console.log('A nova quantidade é >= 1. O estado será atualizado.');
    
    // O código que deveria forçar a atualização
    this.quantities = {
      ...this.quantities,
      [productId]: newQuantity
    };

    // Detetive 5: Como ficou o objeto de quantidades DEPOIS da atualização?
    console.log('Novo objeto de quantidades:', this.quantities);
  } else {
    console.log('A nova quantidade é menor que 1. Nenhuma ação será tomada.');
  }
}
}