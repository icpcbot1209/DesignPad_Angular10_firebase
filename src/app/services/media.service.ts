import { Injectable } from '@angular/core';
import { ItemStatus } from '../models/enums';
import { DesignService } from './design.service';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  audio = new Audio();
  isPlayMusic: boolean = true;
  playMusicProgressTimer;
  currentTime = 0;
  angel: number = 0;
  duration: number;

  constructor(public ds: DesignService) {}

  addMusic() {
    this.audio.src = this.selectedMusic.downloadURL;

    this.setDefault();
  }

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
    this.duration = this.audio.duration;

    this.audio.load();
    this.audio.currentTime = this.currentTime;
    this.audio.play();

    this.playMusicProgress();
  }

  stopMusic() {
    this.audio.pause();
    clearInterval(this.playMusicProgressTimer);

    let ele = document.querySelector('.rotateIcon').firstChild as HTMLElement;
    ele.style.transform = 'rotate(0deg)';
  }

  playMusicProgress() {
    let rotateEle = document.querySelector('.rotateIcon').firstChild as HTMLElement;
    let progressEle = document.querySelector('#progress') as HTMLElement;

    console.log(this.audio.currentTime);
    this.playMusicProgressTimer = setInterval(() => {
      this.angel++;
      if (this.angel == 360) this.angel = 0;
      rotateEle.style.transform = 'rotate(' + this.angel + 'deg)';

      this.currentTime = this.audio.currentTime;
      progressEle.style.width = (this.audio.currentTime / this.duration) * 100 + '%';

      if (this.audio.currentTime >= this.duration) {
        this.setDefault();
      }
    }, 10);
  }

  deleteMusic() {
    this.selectedMusic = null;
    this.ds.status = ItemStatus.none;
    this.audio.pause();
    this.setDefault();
  }

  setDefault() {
    this.isPlayMusic = true;
    this.currentTime = 0;
    this.angel = 0;

    clearInterval(this.playMusicProgressTimer);

    setTimeout(() => {
      let ele = document.querySelector('.rotateIcon').firstChild as HTMLElement;
      ele.style.transform = 'rotate(0deg)';
      ele = document.querySelector('#progress') as HTMLElement;
      ele.style.width = '0%';
    });
  }

  setMusicPosition(pos) {
    if (!this.isPlayMusic) {
      this.stopMusic();
    }

    this.currentTime = (this.selectedMusic.duration * Number.parseFloat(pos)) / 100;
    this.audio.currentTime = this.currentTime;
    console.log(this.selectedMusic.duration, pos, this.currentTime);

    this.isPlayMusic = false;
    this.playMusic();
    // this.audio.play();
  }
}
