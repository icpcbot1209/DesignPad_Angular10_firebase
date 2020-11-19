import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AssetService {
  constructor(private db: AngularFirestore) {}
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
}

export interface AssetImage {
  downloadURL: string;
  path: string;
  width: number;
  height: number;
  timestamp: number;
}
