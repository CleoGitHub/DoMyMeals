import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  user = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.user = this.authService.getConnectedUser();
  }

  signOut(){
    this.authService.signOut();
  }

}
