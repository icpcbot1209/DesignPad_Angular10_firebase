import { Component, OnInit } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';

@Component({
  selector: 'app-music-toolbar',
  templateUrl: './music-toolbar.component.html',
  styleUrls: ['./music-toolbar.component.scss'],
})
export class MusicToolbarComponent implements OnInit {
  isPlay: boolean = true;

  constructor(public ds: DesignService) {}

  ngOnInit(): void {}

  togglePlayButton() {
    this.isPlay = !this.isPlay;

    if (this.isPlay) this.playMusic();
  }

  playMusic() {
    let file = this.ds.selectedMusic.downloadURL;
    // let player = new AudioPlayer()
  }
}
