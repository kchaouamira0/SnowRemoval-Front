import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credentials } from '../models/credentials';
import { JwtResponse } from '../models/JwtResponse';
import { SignupCredentials } from '../models/signupCredentials';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseUrl = "http://4.174.194.81:8081/api/v1/auth" ;
  constructor(private http : HttpClient) {  }
 
  login(credentials : Credentials):Observable<JwtResponse>{
    return this.http.post<JwtResponse>(this.baseUrl+"/authenticate",credentials)
}


signup(credentials : SignupCredentials):Observable<JwtResponse>{
  return this.http.post<JwtResponse>(this.baseUrl+"/register",credentials);
}

}
