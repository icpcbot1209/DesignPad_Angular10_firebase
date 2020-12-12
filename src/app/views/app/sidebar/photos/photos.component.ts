import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AssetImage } from 'src/app/models/models';
import { decideHeights } from 'src/app/models/geometry';

import { AssetService } from 'src/app/services/asset.service';
import { DesignService } from 'src/app/services/design.service';

@Component({
  selector: 'app-sidebar-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements AfterViewInit {
  @ViewChild('gridContainer', { static: false }) gridContainer: ElementRef;
  constructor(public assetService: AssetService, public ds: DesignService) {}

  ngAfterViewInit(): void {
    this.readImagesByTag('');
  }

  onImgClick(assetImage: AssetImage) {
    this.ds.addImageItem(assetImage);
  }

  onStartDrag(event: DragEvent, assetImage: AssetImage) {
    event.dataTransfer.setData('jsonAssetImage', JSON.stringify(assetImage));
  }

  onKeyUpSearch(event) {
    if (event.keyCode == 13) {
      this.readImagesByTag(event.target.value);
    }
  }

  isLoading = false;
  assetImages: AssetImage[] = [];
  heights: number[] = [];
  readImagesByTag(tag: string) {
    this.isLoading = true;
    this.assetService.readImageByTag(tag).subscribe((data) => {
      this.assetImages = data.map((e) => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data(),
        } as AssetImage;
      });

      this.heights = decideHeights(this.assetImages, 329, 150, 4);
      this.isLoading = false;
    });
  }
}
