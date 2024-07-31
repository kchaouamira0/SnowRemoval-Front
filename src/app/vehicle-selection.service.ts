import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleSelectionService {
  private selectedVehicleSubject = new BehaviorSubject<number | null>(null);
  selectedVehicle$ = this.selectedVehicleSubject.asObservable();

  selectVehicle(vehicle: number): void {
    this.selectedVehicleSubject.next(vehicle);
  }

  getSelectedVehicle(): number | null {
    return this.selectedVehicleSubject.value;
  }
}
