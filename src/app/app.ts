import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'ford-lego-portfolio';

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.createLegoBackground();
  }

  createLegoBackground() {
    const legoBackground = this.document.getElementById('lego-background');
    if (!legoBackground) return;

    // Previne a criação duplicada de blocos
    if (legoBackground.childElementCount > 0) return;

    const bgColors = ['#FFD700', '#FF0000', '#0000FF', '#008000', '#FFFFFF'];
    for (let i = 0; i < 30; i++) {
      const block = this.renderer.createElement('div');
      this.renderer.setStyle(block, 'position', 'absolute');
      this.renderer.setStyle(block, 'width', '20px');
      this.renderer.setStyle(block, 'height', '20px');
      this.renderer.setStyle(block, 'opacity', '0.3');
      this.renderer.setStyle(block, 'left', `${Math.random() * 100}vw`);
      this.renderer.setStyle(block, 'animation', `fall ${Math.random() * 5 + 5}s linear infinite`);
      this.renderer.setStyle(block, 'animation-delay', `${Math.random() * 5}s`);
      this.renderer.setStyle(block, 'background-color', bgColors[Math.floor(Math.random() * bgColors.length)]);
      this.renderer.appendChild(legoBackground, block);
    }

    const keyframes = `
      @keyframes fall {
        from { transform: translateY(-50px) rotate(0deg); }
        to { transform: translateY(100vh) rotate(360deg); }
      }
    `;
    const style = this.renderer.createElement('style');
    style.innerHTML = keyframes;
    this.renderer.appendChild(this.document.head, style);
  }
}