import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImageUpload } from 'src/app/models/image-upload';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss'],
})
export class UploadTaskComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private storage: AngularFireStorage,
    private db: AngularFirestore
  ) {}

  @Input() file: File;
  @Input() taskType: string;

  upload: ImageUpload = new ImageUpload(
    this.authService,
    this.storage,
    this.db
  );

  async ngOnInit() {
    if (this.taskType == 'user_uploads')
      this.upload.uploadImage(this.file, false);
    else if (this.taskType == 'admin_uploads')
      this.upload.uploadImage(this.file, true);
  }

  isActive(snapshot) {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }
}

const TASK_TYPE = {
  user_uploads: 'user_uploads',
  admin_uploads: 'admin_uploads',
};