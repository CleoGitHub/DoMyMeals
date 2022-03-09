import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value
    return pass === confirmPass ? null : { notSame: true }
  }

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });
  }

  ngOnInit() {
  }

  register(){
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.get('email').value, this.registerForm.get('password').value).then(() => {
        this.router.navigate(['/login']);
      });
    }  
  }

  login(){
    this.router.navigate(['/login']);
  }
}
