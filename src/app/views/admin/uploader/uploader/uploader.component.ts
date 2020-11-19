import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { MyFile } from 'src/app/services/myfiles.service';
import { DesignService } from 'src/app/services/design.service';
import { AssetService } from 'src/app/services/asset.service';
@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent implements OnInit {
  constructor(
    public assetService: AssetService,
    public authService: AuthService,
    private designService: DesignService
  ) {}

  ngOnInit() {
    if (!this.assetService.assetImages$) this.assetService.init();
  }

  isHovering: boolean;

  files: File[] = [];

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

  onImgClick(myfile: MyFile) {
    this.designService.uploads_click_image(myfile);
  }
}
