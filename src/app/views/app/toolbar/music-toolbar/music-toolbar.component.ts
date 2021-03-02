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

  togglePlayButton() {
    if (this.media.isPlayMusic) this.media.playMusic();
    else this.media.stopMusic();

    this.media.isPlayMusic = !this.media.isPlayMusic;
  }
}
