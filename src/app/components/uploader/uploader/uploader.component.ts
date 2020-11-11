import { Component, OnInit } from '@angular/core';
import { MyfilesService } from 'src/app/services/myfiles.service';

@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent implements OnInit {
  constructor(public myfilesService: MyfilesService) {}

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
}
