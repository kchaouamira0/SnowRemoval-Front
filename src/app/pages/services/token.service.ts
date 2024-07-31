import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }
  saveToken(token: string, name: string, role: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
  
    localStorage.setItem('role', role);

  }
}
