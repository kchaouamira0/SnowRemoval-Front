import { Component, OnInit, OnDestroy } from '@angular/core';
import { Credentials } from '../models/credentials';
import { AuthenticationService } from '../services/authentication.service';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 
  form: Credentials = {
    email: '',
    password: ''
  }
 
  constructor(private authService : AuthenticationService, private tokenService : TokenService, private router : Router) {}

  
  ngOnInit() {


  }

  onSubmit(){
    this.authService.login(this.form).subscribe(
      data => {
        this.tokenService.saveToken(data.token,data.name,data.role)
          this.router.navigate(['/dashboard'])
      },
      err => console.log(err)
    )
  }

  }


