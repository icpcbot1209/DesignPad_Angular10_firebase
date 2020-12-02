import { Component, OnInit } from '@angular/core';
import { MyfilesService } from 'src/app/services/myfiles.service';
import { AuthService } from 'src/app/shared/auth.service';
import { DesignService } from 'src/app/services/design.service';
import { AssetImage } from 'src/app/models/models';
@Component({
  selector: 'user-uploads',
  templateUrl: './user-uploads.component.html',
  styleUrls: ['./user-uploads.component.scss'],
})
export class UserUploadsComponent implements OnInit {
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

  onImgClick(myfile: AssetImage) {
    this.designService.uploads_click_image(myfile);
  }
}
