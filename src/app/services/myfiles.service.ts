import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MyfilesService {
  constructor(private db: AngularFirestore) {}

  myfiles$: Observable<MyFile[]>;

  init() {
    this.myfiles$ = this.db
      .collection<MyFile>('files', (ref) => ref.orderBy('timestamp'))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as MyFile;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
}

interface MyFile {
  downloadURL: string;
  path: string;
  timestamp: number;
}
