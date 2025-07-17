import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  private autoPlayInterval: any;

  cars = [
    {
      title: 'Ford Mustang GT',
      description: 'O ícone americano em sua forma mais divertida.',
      imgSrc: 'assets/images/mustang.png'
    },
    {
      title: 'Ford Ranger Raptor',
      description: 'A picape que encara qualquer terreno de blocos.',
      imgSrc: 'assets/images/ranger.png'
    },
    {
      title: 'Ford Bronco Sports',
      description: 'Aventura selvagem, peça por peça.',
      imgSrc: 'assets/images/bronco.png'
    },
    {
      title: 'Ford GT 2022',
      description: 'Velocidade e design lendários.',
      imgSrc: 'assets/images/fordgt.png'
    }
  ];

  currentSlide = 0;

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    clearInterval(this.autoPlayInterval);
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.cars.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.cars.length) % this.cars.length;
  }

  manualChange(direction: 'prev' | 'next') {
    clearInterval(this.autoPlayInterval);
    direction === 'next' ? this.nextSlide() : this.prevSlide();
    this.startAutoPlay();
  }
}