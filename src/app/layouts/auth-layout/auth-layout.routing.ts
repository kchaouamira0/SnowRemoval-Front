import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { authGuard } from 'src/app/guards/auth.guard';

export const AuthLayoutRoutes: Routes = [
    { path: 'login',          component: LoginComponent },
    { path: 'register',       component: RegisterComponent },
    {path : 'home' , component: HomeComponent }
];
