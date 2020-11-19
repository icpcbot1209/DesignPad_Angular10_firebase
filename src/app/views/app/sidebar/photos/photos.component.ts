import { Component, OnInit } from '@angular/core';
import { AssetImage, AssetService } from 'src/app/services/asset.service';
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
    if (!this.assetService.assetImages$) this.assetService.init();
  }

  onImgClick(assetImage: AssetImage) {
    this.designService.photos_click_image(assetImage);
  }
}
