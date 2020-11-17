import { Component, OnInit } from '@angular/core';
import { MyfilesService } from 'src/app/services/myfiles.service';
import { AuthService } from 'src/app/shared/auth.service';
import { MyFile } from 'src/app/services/myfiles.service';
import { DesignService } from 'src/app/services/design.service';
@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent implements OnInit {
  constructor(
    public myfilesService: MyfilesService,
    public authService: AuthService,
    private designService: DesignService
  ) {}

  ngOnInit() {
    if (!this.myfilesService.myfiles$) this.myfilesService.init();
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

  onImgClick(file: MyFile) {
    this.designService.theDesign.pages[0].imageOnes.push({
      url: file.downloadURL,
      left: 50,
      top: 50,
      width: 300,
      height: 300,
    });
  }
}
