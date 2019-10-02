import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionSheetController, LoadingController, ModalController, NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {PlacesService} from '../../places.service';
import {PlacesModel} from '../../places.model';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';
import {Subscription} from 'rxjs';
import {BookingService} from '../../../bookings/booking.service';
import {AuthService} from '../../../auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: PlacesModel;
  isBookable = false;
  private placesSub: Subscription;

  constructor(private route: ActivatedRoute,
              private placesService: PlacesService,
              private navController: NavController,
              private modalController: ModalController,
              private actionSheetController: ActionSheetController,
              private bookingService: BookingService,
              private loading: LoadingController,
              private authService: AuthService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/discover');
        return;
      }
      this.placesSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.isBookable = place.userId !== this.authService.userId;
      });
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
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
        selectedPlace: this.place,
        selectedMode: mode
      }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        this.loading.create({message: 'booking...'}).then(el => {
          el.present();
          this.bookingService.addBooking(
              this.place.id,
              this.place.title,
              this.place.image,
              resultData.data.bookingData.firstName,
              resultData.data.bookingData.lastName,
              resultData.data.bookingData.guestNumber,
              resultData.data.bookingData.from,
              resultData.data.bookingData.to
          ).subscribe(() => {
            el.dismiss();
          });
        });
      }
    });
  }
}
