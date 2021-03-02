import { Component, OnInit } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { MediaService } from 'src/app/services/media.service';

@Component({
  selector: 'app-music-toolbar',
  templateUrl: './music-toolbar.component.html',
  styleUrls: ['./music-toolbar.component.scss'],
})
export class MusicToolbarComponent implements OnInit {
  constructor(public ds: DesignService, public media: MediaService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // document.getElementById('progress_bar_box').addEventListener('mousedown', function (e) {
    //   let x = e.pageX - this.offsetLeft;
    //   let clickedValue = (x / this.offsetWidth) * 100;
    //   (document.querySelector('#progress') as HTMLElement).style.width = clickedValue + '%';
    // });
  }

  ngOnDestroy(): void {
    (document.querySelector('.rotateIcon') as HTMLElement).style.border = '';
  }

  togglePlayButton() {
    if (this.media.isPlayMusic) {
      this.media.playMusic();
    } else this.media.stopMusic();

    this.media.isPlayMusic = !this.media.isPlayMusic;
  }

  deleteMusic() {
    this.media.deleteMusic();
  }

  setProgressPosition(e) {
    let ele = document.getElementById('progress_bar_box') as HTMLElement;

    let x = e.pageX - ele.offsetLeft;
    let clickedValue = (x / ele.offsetWidth) * 100;
    this.media.setMusicPosition(clickedValue);
  }
}
