import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { AssetImage } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class MyfilesService {
  constructor(private db: AngularFirestore, private authService: AuthService) {
    this.authService.subjectAuth.subscribe((isAuthed) => {
      if (isAuthed) this.init();
    });
  }

  myfiles$: Observable<AssetImage[]>;

  init() {
    if (!this.authService.user) return;
    let userId = this.authService.user.uid;

    this.myfiles$ = this.db
      .collection<AssetImage>('UserFiles', (ref) =>
        ref.where('userId', '==', userId)
      )
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
