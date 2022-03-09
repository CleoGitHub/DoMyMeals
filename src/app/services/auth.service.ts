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
      console.log(this.connectedUser.value)
      router.navigate(['']);
    });
  }

  isSignedIn(): boolean {
    return this.connectedUser.value !== null;
 }

  getConnectedUser(){
    return this.connectedUser.asObservable();
  }

  register(email: string, password:string){
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  signIn(email: string, password:string){
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  signOut(){
    return this.auth.signOut();
  }
}
