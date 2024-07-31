import { AfterViewInit, Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import * as Leaflet from 'leaflet';
import * as proj4 from 'proj4';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';



// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";
import { HttpClient } from '@angular/common/http';
import { FeatureCollection, GeoJsonObject, Feature, GeoJsonProperties,  Geometry  } from 'geojson';
import { VehicleSelectionService } from 'src/app/vehicle-selection.service';


//import { ShapeService } from 'src/app/shape.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit{
  [x: string]: any;

   options: Leaflet.MapOptions;


  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  private map;
  private vehicleLayers: { [key: number]: any } = {};
  private highlightColor = 'yellow';
  private colors: string[] = ['red', 'blue', 'green', 'purple', 'orange'];
  private currentLocation = { lat: 0, lng: 0 };
  private currentLocationMarker: Leaflet.Marker;
  private customIcon;
  private firstSequence: { [key: number]: number } = {};
  private currentSequence: { [key: number]: number } = {};
  private vehicleData: { [key: number]: { objectId: number, sequence: number }[] } = {};




  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [48.2325, -79.0286],
      zoom: 13
    });
  
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  
    this.map.on('zoomend', () => {
      const currentZoom = this.map.getZoom();
      this.adjustTooltipsVisibility(currentZoom);
    });
  }
  

  private loadGeoJsonAndCsv(): void {
    this.http.get('assets/data/RN2.geojson').subscribe((geojson: any) => {
      Leaflet.geoJSON(geojson, {
        style: { color: 'grey' }
      }).addTo(this.map);
  
      this.http.get('assets/data/RoutingRN.csv', { responseType: 'text' }).subscribe((csvData: string) => {
        this.vehicleData = this.parseCSV(csvData);
        const groupedFeatures = this.groupGeoJSONByVehicle(geojson, this.vehicleData);
        this.addGeoJSONLayers(groupedFeatures);
      });
    });
  }
  
  private parseCSV(csvData: string): { [key: number]: { objectId: number, sequence: number }[] } {
    const lines = csvData.trim().split('\n');
    const result: { [key: number]: { objectId: number, sequence: number }[] } = {};
  
    lines.forEach((line, index) => {
      if (index > 0) {  // Skip the header
        const [objectId, vehicle, sequence] = line.split(',').map(value => parseInt(value, 10));
        if (!result[vehicle]) {
          result[vehicle] = [];
          this.firstSequence[vehicle] = objectId;  // Enregistrer la première séquence pour ce véhicule
        }
        result[vehicle].push({ objectId, sequence });
      }
    });
  
    return result;
  }
  
  
  private groupGeoJSONByVehicle(geojson: FeatureCollection, vehicleData: { [key: number]: { objectId: number, sequence: number }[] }): { [key: number]: FeatureCollection } {
    const groupedFeatures: { [key: number]: Feature[] } = {};
  
    geojson.features.forEach(feature => {
      const objectId = feature.properties.OBJECTID;
      for (const vehicle in vehicleData) {
        vehicleData[vehicle].forEach(data => {
          if (data.objectId === objectId) {
            if (!groupedFeatures[vehicle]) {
              groupedFeatures[vehicle] = [];
            }
            groupedFeatures[vehicle].push(feature);
          }
        });
      }
    });
  
    const groupedGeoJSON: { [key: number]: FeatureCollection } = {};
    for (const vehicle in groupedFeatures) {
      groupedGeoJSON[parseInt(vehicle, 10)] = { type: 'FeatureCollection', features: groupedFeatures[vehicle] };
    }
  
    return groupedGeoJSON;
  }
  


  private addGeoJSONLayers(groupedFeatures: { [key: number]: FeatureCollection }): void {
    for (const vehicle in groupedFeatures) {
      const color = this.colors[parseInt(vehicle, 10) - 1];
      const layer = Leaflet.geoJSON(groupedFeatures[vehicle], {
        style: (feature) => {
          return feature.properties.OBJECTID === this.firstSequence[parseInt(vehicle, 10)]
            ? { color: this.highlightColor }
            : { color };
        },
        onEachFeature: (feature, layer) => {
          const sequenceData = this.vehicleData[parseInt(vehicle)].find(item => item.objectId === feature.properties.OBJECTID);
          if (sequenceData) {
            // Créer le tooltip mais ne pas l'ouvrir automatiquement
            layer.bindTooltip(sequenceData.sequence.toString(), { permanent: true, direction: 'top', opacity: 0 });
          }
        }
      });
  
      this.vehicleLayers[parseInt(vehicle, 10)] = layer;
    }
  }
  
  
  
  private updateMapLayers(selectedVehicle: number | null): void {
    // Retirer toutes les couches actuellement affichées
    Object.values(this.vehicleLayers).forEach(layer => {
      this.map.removeLayer(layer);
    });
  
    // Ajouter la couche du véhicule sélectionné, s'il y en a un
    if (selectedVehicle !== null && this.vehicleLayers[selectedVehicle]) {
      this.vehicleLayers[selectedVehicle].addTo(this.map);
      this.adjustTooltipsVisibility(this.map.getZoom());  // Ajuster la visibilité des tooltips basée sur le niveau de zoom actuel
    }
  }
  
  

  private trackLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(position => {
        const lat =position.coords.latitude;
        const lng =position.coords.longitude;

        this.currentLocation.lat = lat;
        this.currentLocation.lng = lng;

        if (this.currentLocationMarker) {
          this.currentLocationMarker.setLatLng([lat, lng]);
        } else {
          this.currentLocationMarker = Leaflet.marker([lat, lng], { icon: this.customIcon }).addTo(this.map)
            .bindPopup('Vous êtes ici')
            .openPopup();
        }

        this.map.setView([lat, lng], this.map.getZoom());
      }, error => {
        console.error('Error getting location', error);
      }, {
        enableHighAccuracy: false,  // Désactiver la haute précision
        timeout: 10000,             // Augmenter le délai d'attente à 10 secondes
        maximumAge: 0
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  private adjustTooltipsVisibility(zoomLevel: number): void {
    Object.values(this.vehicleLayers).forEach(layer => {
      layer.eachLayer((subLayer: any) => {
        const tooltip = subLayer.getTooltip();
        if (zoomLevel >= 16) {  // Choisir le niveau de zoom approprié
          tooltip.setOpacity(1.0);  // Rendre le tooltip visible
        } else {
          tooltip.setOpacity(0);  // Cacher le tooltip
        }
      });
    });
  }
  
  

  constructor(  private http: HttpClient,     private vehicleSelectionService: VehicleSelectionService

  ) { this.customIcon = Leaflet.icon({
    iconUrl: 'assets/images/marker.png', // Chemin vers votre image
    iconSize: [32, 32], // Taille de l'icône
    iconAnchor: [16, 32], // Point de l'icône qui correspond à la position du marqueur
    popupAnchor: [0, -32] // Point de la popup par rapport à l'icône
  });}
    
  ngOnInit(): void {
    this.vehicleSelectionService.selectedVehicle$.subscribe(selectedVehicle => {
      this.updateMapLayers(selectedVehicle);
    });

  }

  

  ngAfterViewInit(): void {
    this.initMap();
    this.loadGeoJsonAndCsv();
    this.trackLocation();
    
  }}


 

  



  



    
  


  






  


  
  


 
  


