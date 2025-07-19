import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio = new Audio();
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  public isPlaying$ = this.isPlayingSubject.asObservable();

  constructor() {
    this.audio.src = 'assets/music/theme.mp3'; // Caminho para a sua música
    this.audio.loop = true; // Faz a música repetir
    this.audio.volume = 0.3; // Começa com um volume mais baixo
  }

  togglePlayPause() {
    if (this.audio.paused) {
      this.audio.play().catch(error => {
        // O navegador pode bloquear o autoplay, isso é normal.
        // O usuário precisa interagir com a página primeiro.
        console.log('Playback foi impedido pelo navegador. O usuário precisa clicar na página.');
      });
      this.isPlayingSubject.next(true);
    } else {
      this.audio.pause();
      this.isPlayingSubject.next(false);
    }
  }
}