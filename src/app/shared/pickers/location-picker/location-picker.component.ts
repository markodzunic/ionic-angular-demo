import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {ActionSheetController, AlertController, ModalController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MapModalComponent } from '../../map-modal/map-modal.component';
import { environment } from '../../../../environments/environment';
import {Coordinates, PlaceLocation} from '../../../places/location.model';
import {Capacitor, Plugins} from '@capacitor/core';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  selectedLocationImage: string;
  isLoading = false;

  constructor(private modalCtrl: ModalController,
              private http: HttpClient,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController) {}

  ngOnInit() {}

  onPickLocation() {
    this.actionSheetCtrl.create({
      header: 'please choose',
      buttons: [{
        text: 'Auto-Locate',
        handler: () => {
          this.locateUser();
        }
      },
        {
          text: 'Pick On Map',
          handler: () => {
            this.openMap();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(el => {
      el.present();
    });
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    Plugins.Geolocation.getCurrentPosition().then(el => {
      const coordinates: Coordinates = {lat: el.coords.latitude, lng: el.coords.longitude};
      this.createAddress(coordinates.lat, coordinates.lng);
    }).catch(err => {
      this.showErrorAlert();
    });
  }

  private showErrorAlert() {
    this.alertCtrl.create({header: 'Could not fetch location.', message: 'please pick location'}).then(el => {
      el.present();
    });
  }

  private openMap() {
    this.modalCtrl.create({ component: MapModalComponent }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        const coordinates: Coordinates = {
          lat: modalData.data.lat,
          lng: modalData.data.lng
        };
        this.createAddress(coordinates.lat, coordinates.lng);
      });
      modalEl.present();
    });
  }

  private createAddress(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat,
      lng,
      address: null,
      staticMapImageUrl: null
    };
    this.isLoading = true;
    this.getAddress(lat, lng)
        .pipe(
            switchMap(address => {
              pickedLocation.address = address;
              return of(
                  this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
              );
            })
        )
        .subscribe(staticMapImageUrl => {
          pickedLocation.staticMapImageUrl = staticMapImageUrl;
          this.selectedLocationImage = staticMapImageUrl;
          this.isLoading = false;
          this.locationPick.emit(pickedLocation);
        });
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
          environment.googleMapsAPIKey
        }`
      )
      .pipe(
        map(geoData => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.googleMapsAPIKey}`;
  }
}
