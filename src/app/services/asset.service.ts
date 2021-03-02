import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AssetImage } from '../models/models';
import { AssetMusic } from '../models/models';
import { AssetElement } from '../models/models';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class AssetService {
  constructor(private db: AngularFirestore, private storage: AngularFireStorage) {}

  readImageByTag(tag: string) {
    if (tag === '') return this.db.collection<AssetImage>('Images').snapshotChanges();
    else
      return this.db
        .collection<AssetImage>('Images', (ref) => ref.where('tags', 'array-contains', tag))
        .snapshotChanges();
  }

  readMusicByTag(tag: string) {
    if (tag === '') return this.db.collection<AssetMusic>('Musics').snapshotChanges();
    else
      return this.db
        .collection<AssetMusic>('Musics', (ref) => ref.where('tags', 'array-contains', tag))
        .snapshotChanges();
  }

  readElementByTag(tag: string) {
    if (tag === '') return this.db.collection<AssetElement>('Elements').snapshotChanges();
    else
      return this.db
        .collection<AssetElement>('Elements', (ref) => ref.where('tags', 'array-contains', tag))
        .snapshotChanges();
  }

  updateImageTags(assetImage: AssetImage) {
    this.db.collection<AssetImage>('Images').doc(assetImage.uid).update({
      tags: assetImage.tags,
      timestamp: Date.now(),
    });
  }

  updateMusicTags(assetMusic: AssetMusic) {
    this.db.collection<AssetMusic>('Musics').doc(assetMusic.uid).update({
      tags: assetMusic.tags,
      timestamp: Date.now(),
    });
  }

  updateElementTags(assetElement: AssetElement) {
    this.db.collection<AssetElement>('Elements').doc(assetElement.uid).update({
      tags: assetElement.tags,
      timestamp: Date.now(),
    });
  }

  removeImages(arr: AssetImage[]) {
    arr.forEach((asset) => {
      this.storage.ref(asset.path).delete();
      this.db.collection<AssetImage>('Images').doc(asset.uid).delete();
    });
  }

  removeMusics(arr: AssetMusic[]) {
    arr.forEach((asset) => {
      this.storage.ref(asset.path).delete();
      this.db.collection<AssetMusic>('Musics').doc(asset.uid).delete();
    });
  }

  removeElements(arr: AssetElement[]) {
    arr.forEach((asset) => {
      this.storage.ref(asset.path).delete();
      this.db.collection<AssetElement>('Elements').doc(asset.uid).delete();
    });
  }

  async updateMusicThumbnail(file: File, assetMusic: AssetMusic) {
    if (file.type == 'image/jpeg') {
      let orignal = await this.fileToDataURL(file);
      let thumbnail = await this.makeMusicThumbnail(orignal);

      this.db.collection<AssetMusic>('Musics').doc(assetMusic.uid).update({
        thumbnail: thumbnail,
        timestamp: Date.now(),
      });
    }
  }

  makeMusicThumbnail(original: string) {
    return new Promise((resolve, reject) => {
      let thumbnail: string;
      let img = new Image();
      const max = 100;
      img.onload = () => {
        if (img.height > max) {
          var oc = document.createElement('canvas'),
            octx = oc.getContext('2d');
          oc.height = img.height;
          oc.width = img.width;
          octx.drawImage(img, 0, 0);
          oc.width = (img.width / img.height) * max;
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
      img.src = original;
    });
  }

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
}
