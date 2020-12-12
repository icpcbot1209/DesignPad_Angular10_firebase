import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MyfilesService } from 'src/app/services/myfiles.service';
import { AuthService } from 'src/app/shared/auth.service';
import { DesignService } from 'src/app/services/design.service';
import { AssetImage } from 'src/app/models/models';
import { decideHeights } from 'src/app/models/geometry';
import { Subscription } from 'rxjs';

@Component({
  selector: 'user-uploads',
  templateUrl: './user-uploads.component.html',
  styleUrls: ['./user-uploads.component.scss'],
})
export class UserUploadsComponent implements AfterViewInit, OnDestroy {
  constructor(
    public myfilesService: MyfilesService,
    public authService: AuthService,
    private ds: DesignService
  ) {}

  auth$: Subscription;
  ngAfterViewInit(): void {
    this.auth$ = this.authService.subjectAuth.subscribe((isAuth) => {
      if (!isAuth) {
        this.assetImages = [];
        this.heights = [];
      } else {
        this.readImagesByTag(this.authService.user.uid, '');
      }
    });
  }

  ngOnDestroy(): void {
    this.auth$.unsubscribe();
  }

  isLoading = false;
  assetImages: AssetImage[] = [];
  heights: number[] = [];
  readImagesByTag(userId, tag: string) {
    this.isLoading = true;
    this.myfilesService.readImageByTag(userId, tag).subscribe((data) => {
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

  isHovering: boolean;
  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  files: File[] = [];
  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

  onImgClick(assetImage: AssetImage) {
    this.ds.addImageItem(assetImage);
  }

  onStartDrag(event: DragEvent, assetImage: AssetImage) {
    event.dataTransfer.setData('jsonAssetImage', JSON.stringify(assetImage));
  }
}
