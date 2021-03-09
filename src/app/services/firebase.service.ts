import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/models';
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
      role: UserRole.Editor,
    });
  }

  updateUser(user) {}
}
