import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AssetVideo } from '../../../../../app/models/models';
import { decideHeights } from '../../../../../app/models/geometry';

import { AssetService } from '../../../../../app/services/asset.service';
import { DesignService } from '../../../../../app/services/design.service';

@Component({
  selector: 'sidebar-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements AfterViewInit {
  @ViewChild('gridContainer', { static: false }) gridContainer: ElementRef;
  constructor(public assetService: AssetService, public ds: DesignService) {}

  ngAfterViewInit(): void {
    this.readVideosByTag('');
  }

  onImgClick(assetVideo: AssetVideo) {
    // this.ds.addVideoItem(assetVideo);
  }

  onStartDrag(event: DragEvent, assetVideo: AssetVideo) {
    event.dataTransfer.setData('jsonAssetImage', JSON.stringify(assetVideo));
  }

  onKeyUpSearch(event) {
    if (event.keyCode == 13) {
      this.readVideosByTag(event.target.value);
    }
    if (event.key == 'Delete') {
      console.log('Delete');
    }
  }

  isLoading = false;
  assetVideos: AssetVideo[] = [];
  ratios: number[] = [];
  padding: number = 4;
  readVideosByTag(tag: string) {
    this.isLoading = true;
    this.assetService.readVideoByTag(tag).subscribe((data) => {
      this.assetVideos = data.map((e) => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data(),
        } as AssetVideo;
      });

      this.ratios = this.decideHeights(this.assetVideos, 2, 4);
      this.isLoading = false;
    });
  }

  decideHeights(assetVideos: AssetVideo[], count, padding) {
    let ratios: number[] = [];
    // let screenWidth = (document.querySelector('#gridContainer') as HTMLElement).offsetWidth - padding * count * 2;
    let screenWidth = 330 - padding * count * 2;

    for (let i = 0; i < assetVideos.length; i = i + 2) {
      let ratio = screenWidth / (assetVideos[i].width + assetVideos[i + 1].width);

      ratios.push(ratio);
      ratios.push(ratio);
    }

    return ratios;
  }

  tags = [];

  test(event) {
    console.log(event);
  }
}
