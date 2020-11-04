import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { from, Subject } from 'rxjs';

import { getUserRole } from 'src/app/utils/util';

export interface ISignInCredentials {
  email: string;
  password: string;
}

export interface ICreateCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface IPasswordReset {
  code: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user;
  subjectAuth = new Subject<boolean>();

  constructor(private auth: AngularFireAuth) {}

  init() {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        JSON.parse(localStorage.getItem('user'));
        this.subjectAuth.next(true);
      } else {
        this.user = null;
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
        this.subjectAuth.next(false);
      }

    });
  }

  // tslint:disable-next-line:typedef
  emailSignIn(credentials: ISignInCredentials) {
    return this.auth
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(({ user }) => {
        return user;
      });
  }

  async signOut() {
    await this.auth.signOut();
    await localStorage.removeItem("user");
  }

  // tslint:disable-next-line:typedef
  emailSignUp(credentials: ICreateCredentials) {
    return this.auth
      .createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(async ({ user }) => {
        user.updateProfile({
          displayName: credentials.displayName,
        });
        this.auth.updateCurrentUser(user);
        return user;
      });
  }

  googleAuth() {
    return this.auth
      .signInWithPopup(new auth.GoogleAuthProvider())
      .then(({ user }) => {
        return user;
      });
  }

  facebookAuth() {
    return this.auth
      .signInWithPopup(new auth.FacebookAuthProvider())
      .then(({ user }) => {
        return user;
      });
  }

  // tslint:disable-next-line:typedef
  sendPasswordResetEmail(email) {
    return this.auth.sendPasswordResetEmail(email).then(() => {
      return true;
    });
  }

  // tslint:disable-next-line:typedef
  resetPassword(credentials: IPasswordReset) {
    return this.auth
      .confirmPasswordReset(credentials.code, credentials.newPassword)
      .then((data) => {
        return data;
      });
  }

  // tslint:disable-next-line:typedef
  async getUser() {
    const u = await this.auth.currentUser;
    return { ...u, role: getUserRole() };
  }
}
