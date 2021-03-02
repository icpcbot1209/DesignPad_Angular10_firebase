import { Injectable } from '@angular/core';
import { DesignService } from './design.service';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  audio = new Audio();
  isPlayMusic: boolean = true;

  constructor(public ds: DesignService) {}

  selectedMusic = null;
  convertDuration(duration) {
    let min = Math.floor(parseInt(duration) / 60);
    let sec = Math.ceil(parseInt(duration) % 60).toString();

    if (Number.parseInt(sec) < 10) {
      sec = '0' + sec;
    }

    return min + ':' + sec;
  }

  playMusic() {
    this.audio.src = this.selectedMusic.downloadURL;
    this.audio.load();
    this.audio.play();
  }

  stopMusic() {
    this.audio.pause();
  }
}
