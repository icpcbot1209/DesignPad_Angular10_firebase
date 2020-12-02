import { Component, OnInit } from '@angular/core';
import { AssetImage } from 'src/app/models/models';
import { AssetService } from 'src/app/services/asset.service';
import { DesignService } from 'src/app/services/design.service';

@Component({
  selector: 'app-sidebar-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {
  constructor(
    public assetService: AssetService,
    public designService: DesignService
  ) {}

  ngOnInit(): void {
    this.readImagesByTag('');
  }

  onImgClick(assetImage: AssetImage) {
    this.designService.photos_click_image(assetImage);
  }

  onKeyUpSearch(event) {
    if (event.keyCode == 13) {
      this.readImagesByTag(event.target.value);
    }
  }

  isLoading = false;
  assetImages: AssetImage[] = [];
  readImagesByTag(tag: string) {
    this.isLoading = true;
    this.assetService.readImageByTag(tag).subscribe((data) => {
      this.assetImages = data.map((e) => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data(),
        } as AssetImage;
      });

      this.isLoading = false;
    });
  }
}
