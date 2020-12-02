import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AssetImage } from '../models/models';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class AssetService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}
  assetImages$: Observable<AssetImage[]>;

  init() {
    this.assetImages$ = this.db
      .collection<AssetImage>('Images')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as AssetImage;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  readImageByTag(tag: string) {
    if (tag === '')
      return this.db.collection<AssetImage>('Images').snapshotChanges();
    else
      return this.db
        .collection<AssetImage>('Images', (ref) =>
          ref.where('tags', 'array-contains', tag)
        )
        .snapshotChanges();
  }

  updateImageTags(assetImage: AssetImage) {
    this.db.collection<AssetImage>('Images').doc(assetImage.uid).update({
      tags: assetImage.tags,
      timestamp: Date.now(),
    });
  }

  removeImages(arr: AssetImage[]) {
    arr.forEach((asset) => {
      this.storage.ref(asset.path).delete();
      this.db.collection<AssetImage>('Images').doc(asset.uid).delete();
    });
  }
}
