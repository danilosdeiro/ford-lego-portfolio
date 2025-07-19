import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio = new Audio();
  private isAudioLoaded = false;
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  public isPlaying$ = this.isPlayingSubject.asObservable();

  constructor() { }

  togglePlayPause() {
    if (!this.isAudioLoaded) {
      this.audio.src = 'assets/music/theme.mp3';
      this.audio.loop = true;
      this.audio.volume = 0.3;
      this.isAudioLoaded = true;
    }

    if (this.audio.paused) {
      this.audio.play().catch(error => {
        console.log('Playback foi impedido pelo navegador. O usuário precisa interagir com a página.');
      });
      this.isPlayingSubject.next(true);
    } else {
      this.audio.pause();
      this.isPlayingSubject.next(false);
    }
  }
}