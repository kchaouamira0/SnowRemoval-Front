import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { VehicleSelectionService } from 'src/app/vehicle-selection.service';


declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
 

    
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  [x: string]: any;


  public menuItems: any[];
  public form: FormGroup;
  public isCollapsed = true;


  selectVehicle(vehicleId: number) {
    this.vehicleSelected.emit(vehicleId);
  }

  constructor(private router: Router, private vehicleSelectionService: VehicleSelectionService) { }

 
  onRadioChange(vehicle: number): void {
    this.vehicleSelectionService.selectVehicle(vehicle);
  }


  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
 

}
function Output(): (target: SidebarComponent, propertyKey: "vehicleSelected") => void {
  throw new Error('Function not implemented.');
}

