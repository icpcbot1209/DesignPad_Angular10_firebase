import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';

@Injectable({
  providedIn: 'root',
})
export class MyfilesService {
  constructor(private db: AngularFirestore, private authService: AuthService) {
    this.authService.subjectAuth.subscribe((isAuthed) => {
      if (isAuthed) this.init();
    });
  }

  myfiles$: Observable<MyFile[]>;

  init() {
    if (!this.authService.user) return;
    let userId = this.authService.user.uid;

    this.myfiles$ = this.db
      .collection<MyFile>('files', (ref) => ref.where('userId', '==', userId))
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

export interface MyFile {
  downloadURL: string;
  path: string;
  timestamp: number;
  userId: string;
}
