import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AdminTemplates, User, UploadUserTemplate } from '../models/models';
import { UserRole } from 'src/app/shared/auth.roles';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(public db: AngularFirestore) {}

  users = [];
  readUser(tag) {
    return this.db
      .collection<User>('User', (ref) => ref.where('uid', '==', tag))
      .snapshotChanges();
  }

  createUser(user) {
    this.db.collection<User>('User').add({
      uid: user.uid,
      displayName: user.displayName,
      role: UserRole.Editor,
      template: [],
    });
  }

  updateUserTemplate(templates: UploadUserTemplate[], docId) {
    this.db.collection<User>('User').doc(docId).update({
      template: templates,
    });
  }

  readAdminTemplates() {
    return this.db.collection<AdminTemplates>('AdminTemplates').snapshotChanges();
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