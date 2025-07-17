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
    if (legoBackground.childElementCount > 0) return;

    const colors = ['#fde047', '#ef4444', '#3b82f6', '#22c55e', '#ffffff'];
    const brickTypes = [
      { width: 40, height: 20, studs: [{ cx: 10, cy: 5 }, { cx: 30, cy: 5 }] },
      { width: 20, height: 20, studs: [{ cx: 10, cy: 5 }] }
    ];

    for (let i = 0; i < 35; i++) {
      const brickType = brickTypes[Math.floor(Math.random() * brickTypes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const svg = this.renderer.createElement('svg', 'http://www.w3.org/2000/svg');
      this.renderer.setAttribute(svg, 'class', 'lego-brick');
      this.renderer.setAttribute(svg, 'width', `${brickType.width}`);
      this.renderer.setAttribute(svg, 'height', `${brickType.height + 5}`);
      this.renderer.setAttribute(svg, 'viewBox', `0 0 ${brickType.width} ${brickType.height + 5}`);
      this.renderer.setStyle(svg, 'position', 'absolute');
      this.renderer.setStyle(svg, 'left', `${Math.random() * 100}vw`);
      this.renderer.setStyle(svg, 'animation', `fall ${Math.random() * 8 + 7}s linear infinite`);
      this.renderer.setStyle(svg, 'animation-delay', `${Math.random() * 10}s`);
      const rect = this.renderer.createElement('rect', 'http://www.w3.org/2000/svg');
      this.renderer.setAttribute(rect, 'width', `${brickType.width}`);
      this.renderer.setAttribute(rect, 'height', `${brickType.height}`);
      this.renderer.setAttribute(rect, 'y', '5');
      this.renderer.setAttribute(rect, 'rx', '2');
      this.renderer.setAttribute(rect, 'fill', color);
      this.renderer.appendChild(svg, rect);

      brickType.studs.forEach(stud => {
        const circle = this.renderer.createElement('circle', 'http://www.w3.org/2000/svg');
        this.renderer.setAttribute(circle, 'cx', `${stud.cx}`);
        this.renderer.setAttribute(circle, 'cy', '5');
        this.renderer.setAttribute(circle, 'r', '4');
        this.renderer.setAttribute(circle, 'fill', color);
        this.renderer.setAttribute(circle, 'stroke', 'rgba(0,0,0,0.15)');
        this.renderer.setAttribute(circle, 'stroke-width', '1');
        this.renderer.appendChild(svg, circle);
      });

      this.renderer.appendChild(legoBackground, svg);
    }

    const styleTagId = 'lego-fall-animation';
    if (!this.document.getElementById(styleTagId)) {
      const keyframes = `
        @keyframes fall {
          from { transform: translateY(-60px) rotate(0deg); }
          to { transform: translateY(100vh) rotate(720deg); }
        }
      `;
      const style = this.renderer.createElement('style');
      style.id = styleTagId;
      style.innerHTML = keyframes;
      this.renderer.appendChild(this.document.head, style);
    }
  }
}