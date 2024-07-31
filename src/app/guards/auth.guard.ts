import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
  UrlTree,
  CanActivateFn
} from '@angular/router';
import { Observable } from 'rxjs';


export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem("role");
  const router = inject(Router);
  if (token) {
    
    return true;
  } else{
    router.navigate(['/login']);
    return false;
  }

};
