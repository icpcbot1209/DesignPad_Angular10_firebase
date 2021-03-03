import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImageUpload } from 'src/app/models/image-upload';
import { VideoUpload } from 'src/app/models/video-upload';
import { ElementUpload } from 'src/app/models/element-upload';
import { MusicUpload } from 'src/app/models/music-upload';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss'],
})
export class UploadTaskComponent implements OnInit {
  constructor(private authService: AuthService, private storage: AngularFireStorage, private db: AngularFirestore) {}

  @Input() file: File;
  @Input() taskType: string;

  elementUpload: ElementUpload = new ElementUpload(this.authService, this.storage, this.db);
  upload: ImageUpload = new ImageUpload(this.authService, this.storage, this.db);
  musicUpload: MusicUpload = new MusicUpload(this.authService, this.storage, this.db);
  videoUpload: VideoUpload = new VideoUpload(this.authService, this.storage, this.db);

  async ngOnInit() {
    if (this.file.type == 'image/svg+xml') {
      if (this.taskType == 'user_uploads') this.elementUpload.uploadElement(this.file, false);
      else if (this.taskType == 'admin_uploads') this.elementUpload.uploadElement(this.file, true);
    }
    if (this.file.type == 'image/jpeg') {
      if (this.taskType == 'user_uploads') this.upload.uploadImage(this.file, false);
      else if (this.taskType == 'admin_uploads') this.upload.uploadImage(this.file, true);
    }
    if (this.file.type == 'audio/mpeg') {
      if (this.taskType == 'user_uploads') this.musicUpload.uploadMusic(this.file, false);
      else if (this.taskType == 'admin_uploads') this.musicUpload.uploadMusic(this.file, true);
    }
    if (this.file.type.slice(0, 6) == 'video/') {
      if (this.taskType == 'user_uploads') this.videoUpload.uploadVideo(this.file, false);
      else if (this.taskType == 'admin_uploads') this.videoUpload.uploadVideo(this.file, true);
    }
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }
}

const TASK_TYPE = {
  user_uploads: 'user_uploads',
  admin_uploads: 'admin_uploads',
};
