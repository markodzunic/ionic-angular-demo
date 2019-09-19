import { Component, OnInit } from '@angular/core';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {PlacesService} from '../../places.service';
import {PlacesModel} from '../../places.model';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: PlacesModel;

  constructor(private route: ActivatedRoute,
              private placesService: PlacesService,
              private navController: NavController,
              private modalController: ModalController,
              private actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/discover');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
    });
  }

  onBookPlace() {
    // this.navController.navigateBack('/places/tabs/discover');
    this.actionSheetController.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }

  openBookingModal(mode: 'select' | 'random') {
    this.modalController.create({
      component: CreateBookingComponent,
      componentProps: {
        selectedPlace: this.place
      }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        console.log('Done!');
      }
    });
  }
}
