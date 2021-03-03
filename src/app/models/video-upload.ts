import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';

import { AssetElement, AssetVideo } from './models';
import { Injectable } from '@angular/core';

export class VideoUpload {
  constructor(private authService: AuthService, private storage: AngularFireStorage, private db: AngularFirestore) {}

  task: AngularFireUploadTask;
  percentage: Observable<number> = new Observable<number>();
  snapshot: Observable<any>;
  downloadURL: string;

  orignal: string;
  thumbnail: string;
  width: number;
  height: number;

  fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        let original = reader.result as string;
        resolve(original);
      };
      reader.readAsDataURL(file);
    });
  }

  makeThumbnail(url): Promise<string> {
    return new Promise((resolve, reject) => {
      let thumbnail: string;
      let video = document.createElement('video');
      video.src = url;
      const max = 150;
      // video.onloadedmetadata = () => {
      this.width = video.videoWidth;
      this.height = video.videoHeight;

      if (video.videoHeight > max || video.videoWidth > max) {
        var oc = document.createElement('canvas'),
          octx = oc.getContext('2d');
        // oc.height = video.videoHeight;
        // oc.width = video.videoWidth;
        // octx.drawImage(video, 0, 0);
        // if (oc.width > oc.height) {
        //   oc.width = max;
        //   oc.height = (video.videoHeight / video.videoWidth) * max;
        // } else {
        //   oc.width = (video.videoWidth / video.videoHeight) * max;
        //   oc.height = max;
        // }
        // octx.drawImage(oc, 0, 0, oc.width, oc.height);
        octx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        thumbnail = oc.toDataURL();
        console.log(thumbnail);
      } else {
        try {
          thumbnail = oc.toDataURL();
        } catch (error) {
          return;
        }
      }

      resolve(thumbnail);
      // };
    });
  }

  async uploadVideo(file: File, isAdmin: boolean) {
    this.orignal = await this.fileToDataURL(file);
    console.log(this.orignal);

    let userId = this.authService.user.uid;
    if (isAdmin) userId = 'admin';

    // The storage path
    let path = `user_files/${userId}/video/${Date.now()}_${file.name}`;
    if (isAdmin) path = `assets/video/${Date.now()}_${file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      // tap(console.log),
      // The file's download URL
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.thumbnail = await this.makeThumbnail(this.downloadURL);

        let collectionName = isAdmin ? 'Videos' : 'UserFiles';

        this.db.collection<AssetVideo>(collectionName).add({
          downloadURL: this.downloadURL,
          path,
          thumbnail: '',
          // width: this.width,
          // height: this.height,
          timestamp: Date.now(),
          userId,
          tags: [file.name],
        });
      })
    );
  }
}
