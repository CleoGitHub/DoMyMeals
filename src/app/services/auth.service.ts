import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Firebase User
  private connectedUser = new BehaviorSubject(null);

  constructor(private auth: AngularFireAuth, private router: Router) {
    this.auth.authState.subscribe(user => {
      this.connectedUser.next(user);
    });
  }

  isSignedIn(): boolean {
    return this.connectedUser.value !== null;
 }

  getConnectedUser(){
    return this.connectedUser.asObservable();
  }

  async register(email: string, password:string){
    await this.auth.createUserWithEmailAndPassword(email, password);
    await (await this.auth.currentUser).sendEmailVerification();
    await this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  signIn(email: string, password:string){
    return this.auth.signInWithEmailAndPassword(email, password).then(() => {
      this.router.navigate(['/']);
    });
  }

  signOut(){
    return this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
