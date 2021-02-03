import { Component, OnInit } from '@angular/core';
import { AssetMusic } from 'src/app/models/models';
import { AssetService } from 'src/app/services/asset.service';

@Component({
  selector: 'sidebar-music',
  templateUrl: './musics.component.html',
  styleUrls: ['./musics.component.scss'],
})
export class MusicsComponent implements OnInit {
  selector = '.scrollPanel';
  array = [];
  sum = 10;
  scrollDistance = 2;
  scrollUpDistance = 2;
  throttle = 300;
  direction = '';
  fonts;
  textPart: string = '';
  index: number;
  previousSelectedFontItemIndex: number = null;
  previousSelectedFontItemFamily: string = 'Alata';

  isLoading = false;
  assetMusics: AssetMusic[] = [];
  heights: number[] = [];

  constructor(public assetService: AssetService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.readMusicByTag('');
  }

  readMusicByTag(tag: string) {
    this.isLoading = true;
    this.assetService.readMusicByTag(tag).subscribe((data) => {
      this.assetMusics = data.map((e) => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data(),
        } as AssetMusic;
      });

      this.isLoading = false;
      this.appendItems(0, this.sum);
    });
  }

  onScrollDown(ev) {
    // add another 20 items
    const start = this.sum;
    this.sum += 10;
    this.appendItems(start, this.sum);

    this.direction = 'down';
  }

  appendItems(startIndex, endIndex) {
    this.addItems(startIndex, endIndex, 'push');
  }

  addItems(startIndex, endIndex, _method) {
    if (this.assetMusics != []) {
      for (let i = startIndex; i < endIndex; ++i) {
        if (i >= this.assetMusics.length) return;
        this.array[_method](this.assetMusics[i]);
      }
    }
  }
}
