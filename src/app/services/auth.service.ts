import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Firebase User
  private connectedUser = new BehaviorSubject(null);

  constructor(private toastController: ToastController, private auth: AngularFireAuth, private router: Router) {
    this.auth.authState.subscribe(user => {
      this.connectedUser.next(user);
    });
  }

  isSignedIn(): boolean {
    return this.connectedUser.value !== null && this.connectedUser.value.emailVerified;
 }

  getConnectedUser(){
    return this.connectedUser.asObservable();
  }

  async register(email: string, password:string){
    await this.auth.createUserWithEmailAndPassword(email, password).catch(error => {
      this.toastController.create({
        message: error.message,
        duration: 3000,
        color: 'danger'
      }).then(toast => toast.present());
    });
    await (await this.auth.currentUser).sendEmailVerification();
    await this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  signIn(email: string, password:string){
    return this.auth.signInWithEmailAndPassword(email, password).then(() => {
      this.auth.currentUser.then(user => {
        if (!user.emailVerified) {
          this.toastController.create({
            message: 'Veuillez vérifier votre email',
            duration: 3000,
            color: 'warning'
          }).then(toast => toast.present());

          this.auth.signOut().then(() => {
            this.router.navigate(['/login']);
          });
        } else {
          this.router.navigate(['/']);
        }
      });
    })
    .catch(error => {
      this.toastController.create({
        message: error.message,
        duration: 3000,
        color: 'danger'
        }).then(toast => toast.present());
    });
  }

  signOut(){
    return this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
