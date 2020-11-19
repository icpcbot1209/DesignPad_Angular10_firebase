import { Component, OnInit, Input, ElementRef } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AssetImage } from 'src/app/services/asset.service';

@Component({
  selector: 'upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss'],
})
export class UploadTaskComponent implements OnInit {
  @Input() file: File;
  task: AngularFireUploadTask;

  percentage: Observable<number> = new Observable<number>();
  snapshot: Observable<any>;
  downloadURL;

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore
  ) {}

  imagePreview: string;
  ngOnInit() {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.startUpload();
    };
    reader.readAsDataURL(this.file);
  }

  width;
  height;
  onLoadPreview(preview) {
    this.width = preview.naturalWidth;
    this.height = preview.naturalHeight;
  }

  startUpload() {
    // The storage path
    const path = `assets/image/${Date.now()}_${this.file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      // tap(console.log),
      // The file's download URL
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();

        this.db.collection<AssetImage>('Images').add({
          downloadURL: this.downloadURL,
          path,
          width: this.width,
          height: this.height,
          timestamp: Date.now(),
        });
      })
    );
  }

  isActive(snapshot) {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }
}
