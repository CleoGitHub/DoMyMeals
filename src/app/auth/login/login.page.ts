import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  error : string = "";

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.signIn(this.loginForm.get('email').value, this.loginForm.get('password').value)
    }
  }

  register() {
    this.router.navigate(['/register']);
  }

}
