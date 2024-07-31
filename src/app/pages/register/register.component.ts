import { Component, OnInit } from '@angular/core';
import { SignupCredentials } from '../models/signupCredentials';
import { AuthenticationService } from '../services/authentication.service';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: SignupCredentials = {
    email: '',
    password: '',
    name : '',
    role :'CHAUFFEUR'
  }
  constructor( private authService : AuthenticationService, private tokenService : TokenService, private router : Router) { }

  ngOnInit() {
  }

  onSubmit(): void{

    this.authService.signup(this.form).subscribe(
      data => {
        this.tokenService.saveToken(data.token,data.name,data.role)
          this.router.navigate(['/login']);
      },
      err => console.log(err)
    )
  }

}
