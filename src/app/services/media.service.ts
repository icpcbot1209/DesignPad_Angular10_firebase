import { Injectable } from '@angular/core';
import { ItemStatus } from '../models/enums';
import { DesignService } from './design.service';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  audio = new Audio();
  isPlayMusic: boolean = true;
  rotateTimer;
  progressTimer;
  currentTime = 0;
  angel: number = 0;

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
    console.log(this.audio.src);
    this.audio.load();
    this.audio.currentTime = this.currentTime;
    this.audio.play();

    // this.setProgressbar();
    this.rotateMusicIcon();
  }

  stopMusic() {
    this.audio.pause();
    // clearInterval(this.progressTimer);
    clearInterval(this.rotateTimer);

    let ele = document.querySelector('.rotateIcon').firstChild as HTMLElement;
    ele.style.transform = 'rotate(0deg)';
  }

  rotateMusicIcon() {
    let rotateEle = document.querySelector('.rotateIcon').firstChild as HTMLElement;
    let progressEle = document.querySelector('#progress') as HTMLElement;

    // ele.style.transform = 'rotate(0deg)';
    // this.angel = 0;
    this.rotateTimer = setInterval(() => {
      this.angel++;
      if (this.angel == 360) this.angel = 0;
      rotateEle.style.transform = 'rotate(' + this.angel + 'deg)';

      this.currentTime = this.audio.currentTime;
      progressEle.style.width = this.audio.currentTime * 10 + '%';

      if (this.audio.currentTime >= 10) {
        this.setDefault();
      }
    }, 10);
  }

  setProgressbar() {
    let ele = document.querySelector('#progress') as HTMLElement;

    this.progressTimer = setInterval(() => {
      console.log(this.audio.currentTime);
      this.currentTime = this.audio.currentTime;
      ele.style.width = this.audio.currentTime * 10 + '%';
      if (this.audio.currentTime >= 10) {
        this.currentTime = 0;
        ele.style.width = '0%';

        ele = document.querySelector('.rotateIcon').firstChild as HTMLElement;
        ele.style.transform = 'rotate(0deg)';
        this.isPlayMusic = true;
        clearInterval(this.progressTimer);
        clearInterval(this.rotateTimer);
      }
    }, 10);
  }

  deleteMusic() {
    this.selectedMusic = null;
    this.ds.status = ItemStatus.none;
    this.setDefault();
  }

  setDefault() {
    this.isPlayMusic = true;
    this.currentTime = 0;
    this.angel = 0;

    clearInterval(this.progressTimer);
    clearInterval(this.rotateTimer);

    setTimeout(() => {
      let ele = document.querySelector('.rotateIcon').firstChild as HTMLElement;
      ele.style.transform = 'rotate(0deg)';
      ele = document.querySelector('#progress') as HTMLElement;
      ele.style.width = '0%';
    });
  }
}
