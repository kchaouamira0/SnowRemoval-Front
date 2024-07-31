import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';

import { MapsComponent } from '../../pages/maps/maps.component';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { authGuard } from 'src/app/guards/auth.guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent, canActivate:[authGuard] },

];
