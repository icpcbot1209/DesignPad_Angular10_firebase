import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AdminTemplates, UserData, UploadUserTemplate } from '../models/models';
import { UserRole } from 'src/app/shared/auth.roles';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(public db: AngularFirestore) {}

  users = [];
  readUser(tag) {
    return new Promise((resolve, reject) => {
      this.db
        .collection<UserData>('User', (ref) => ref.where('uid', '==', tag))
        .snapshotChanges()
        .subscribe((data) => {
          let users = data.map((e) => {
            return {
              docId: e.payload.doc.id,
              ...e.payload.doc.data(),
            } as UserData;
          });

          resolve(users[0]);
        });
    });
  }

  readObservableUser(tag) {
    return this.db
      .collection<UserData>('User', (ref) => ref.where('uid', '==', tag))
      .snapshotChanges();
  }

  createUser(user) {
    return new Promise((resolve, reject) => {
      this.db.collection<UserData>('User').add({
        uid: user.uid,
        displayName: user.displayName,
        role: UserRole.Editor,
        template: [],
      });

      resolve(true);
    });
  }

  updateUserTemplate(templates: UploadUserTemplate[], docId) {
    this.db.collection<UserData>('User').doc(docId).update({
      template: templates,
    });
  }

  readAdminTemplates() {
    return this.db.collection<AdminTemplates>('AdminTemplates').snapshotChanges();
  }

  removeAdminTemplates(arr: AdminTemplates[]) {
    arr.forEach((asset) => {
      this.db.collection<AdminTemplates>('AdminTemplates').doc(asset.docId).delete();
    });
  }

  createAdminTemplates(design, thumbnail, width, height) {
    this.db.collection<AdminTemplates>('AdminTemplates').add({
      design: design,
      thumbnail: thumbnail,
      width: width,
      height: height,
    });
  }
}
