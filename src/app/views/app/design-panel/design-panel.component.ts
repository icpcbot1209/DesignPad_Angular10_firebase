import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, Injector } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { Colors } from 'src/app/constants/colors.service';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { MoveableService } from 'src/app/services/moveable.service';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { ItemStatus, ItemType } from 'src/app/models/enums';
import { DownloadService } from 'src/app/services/download.service';
import { MediaService } from 'src/app/services/media.service';
import { UserRole } from 'src/app/shared/auth.roles';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Design, Item, UploadUserTemplate, UserData } from 'src/app/models/models';
import { AngularFirestore } from '@angular/fire/firestore';

declare var ResizeObserver;

@Component({
  selector: 'app-design-panel',
  templateUrl: './design-panel.component.html',
  styleUrls: ['./design-panel.component.scss'],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: true },
    },
  ],
})
export class DesignPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    public ds: DesignService,
    public moveableService: MoveableService,
    private zone: NgZone,
    public toolbarService: ToolbarService,
    public downloadService: DownloadService,
    public media: MediaService,
    public injector: Injector,
    public firebaseService: FirebaseService,
    public ngZone: NgZone,
    public db: AngularFirestore
  ) {}

  foreColor = Colors.getColors().separatorColor;

  @ViewChild('host') host: ElementRef;
  @ViewChild('moveableContainer') moveableContainer: ElementRef;

  resizeObserver;
  ItemType = ItemType;
  ItemStatus = ItemStatus;

  selectedFileType = 'PDF';
  fileTypeItems = [];
  currentRole = JSON.parse(localStorage.getItem('user')).role;
  role = UserRole;

  ngOnInit(): void {
    this.ds.init();
    this.fileTypeItems = ['PDF', 'JPG'];
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      this.zone.run(() => {
        let width = entries[0].contentRect.width;
        let height = entries[0].contentRect.height;

        if (this.ds.zoomMethod === 'fit') {
          this.ds.zoomFitInside(width, height);
        } else if (this.ds.zoomMethod === 'fill') {
          this.ds.zoomFillInside(width, height);
        }
      });
    });

    this.resizeObserver.observe(this.host.nativeElement);
    // this.addKeyEventListeners();

    this.moveableService.init();
  }

  ngOnDestroy() {
    this.resizeObserver.unobserve(this.host.nativeElement);
  }

  zoomOptions = [
    { value: 300, label: '300%' },
    { value: 200, label: '200%' },
    { value: 125, label: '125%' },
    { value: 100, label: '100%' },
    { value: 75, label: '75%' },
    { value: 50, label: '50%' },
    { value: 25, label: '25%' },
    { value: 10, label: '10%' },
  ];

  onSelectZoomOption(method: string, value?: number) {
    if (method === 'custom') {
      this.ds.zoomCustomValue(value);
    } else if (method === 'fit') {
      let width = this.host.nativeElement.clientWidth;
      let height = this.host.nativeElement.clientHeight;

      this.ds.zoomFitInside(width, height);
    } else if (method === 'fill') {
      let width = this.host.nativeElement.clientWidth;
      let height = this.host.nativeElement.clientHeight;

      this.ds.zoomFillInside(width, height);
    }
  }

  addPage() {
    const media = this.injector.get(MediaService);

    if (media.selectedVideo) {
      clearInterval(media.playVideoProgressTimer);
      media.stopVideo();
    }

    for (let i = 0; i < this.ds.theDesign.pages.length; i++)
      for (let j = 0; j < this.ds.theDesign.pages[i].items.length; j++) {
        if (this.ds.theDesign.pages[i].items[j].type == ItemType.video) {
          this.ds.theDesign.pages[i].items[j].onPlayVideo = false;
          this.ds.theDesign.pages[i].items[j].onPlayButton = false;
        }
      }

    this.ds.addPage();

    this.toolbarService.textEditItems.push([]);
  }

  isUploading: boolean = false;
  imgWidth: number;
  imgHeight: number;
  async uploadPage() {
    this.isUploading = true;
    let design: Design = this.ds.theDesign;

    let thumbnail = await this.downloadService.getOnePageAsImg();
    thumbnail = await this.resizeImg(thumbnail);

    await this.firebaseService.createAdminTemplates(design, thumbnail, this.imgWidth, this.imgHeight);
    this.isUploading = false;
  }

  resizeImg(src) {
    return new Promise((resolve, reject) => {
      let thumbnail: string;
      let img = new Image();
      const max = 165;
      img.onload = () => {
        this.imgWidth = img.width;
        this.imgHeight = max;

        if (img.height > max) {
          var oc = document.createElement('canvas'),
            octx = oc.getContext('2d');
          oc.width = img.width;
          oc.height = img.height;
          octx.drawImage(img, 0, 0);

          oc.width = (img.width / img.height) * max;
          this.imgWidth = oc.width;

          oc.height = max;
          octx.drawImage(oc, 0, 0, oc.width, oc.height);
          octx.drawImage(img, 0, 0, oc.width, oc.height);
          thumbnail = oc.toDataURL();
        } else {
          try {
            thumbnail = oc.toDataURL();
          } catch (error) {
            return;
          }
        }

        resolve(thumbnail);
      };
      img.src = src;
    });
  }

  showDownloadContent() {
    this.moveableService.isShowDownload = !this.moveableService.isShowDownload;
  }

  download() {
    this.downloadService.download(this.selectedFileType);
  }

  changeFileType(event) {
    this.selectedFileType = event;
  }

  selectMusic() {
    (document.querySelector('.rotateIcon') as HTMLElement).style.border = '2px solid #00c4cc';
    this.ds.status = ItemStatus.music_selected;
  }

  async UploadUserTemplate() {
    let haveItem: boolean = false;
    for (let i = 0; i < this.ds.theDesign.pages.length; i++) {
      for (let j = 0; j < this.ds.theDesign.pages[i].items.length; j++) {
        if (this.ds.theDesign.pages[i].items[j]) haveItem = true;
      }
    }

    if (haveItem) {
      this.downloadService.onDownloading = true;
      let thumbnail = (await this.downloadService.getOnePageAsImg()) as string;
      thumbnail = (await this.resizeImg(thumbnail)) as string;

      let template = {
        thumbnail: thumbnail,
        width: this.imgWidth,
        height: this.imgHeight,
        design: this.ds.theDesign,
        timestamp: Date.now(),
      } as UploadUserTemplate;

      let user: UserData = (await this.getTemplates()) as UserData;
      let templates = user.template;
      templates.push(template);

      this.firebaseService.updateUserTemplate(templates, user.docId);

      this.downloadService.onDownloading = false;
    }
  }

  getTemplates() {
    return new Promise((resolve, reject) => {
      // this.firebaseService.readUser(JSON.parse(localStorage.getItem('user')).uid).subscribe((data) => {
      //   let users: User[] = data.map((e) => {
      //     return {
      //       docId: e.payload.doc.id,
      //       ...e.payload.doc.data(),
      //     } as User;
      //   });
      //   resolve(users[0]);
      // });
    });
  }
}
