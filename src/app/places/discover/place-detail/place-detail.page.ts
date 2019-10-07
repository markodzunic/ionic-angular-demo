import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionSheetController, AlertController, LoadingController, ModalController, NavController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {PlacesService} from '../../places.service';
import {PlacesModel} from '../../places.model';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';
import {Subscription} from 'rxjs';
import {BookingService} from '../../../bookings/booking.service';
import {AuthService} from '../../../auth/auth.service';
import {MapModalComponent} from '../../../shared/map-modal/map-modal.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: PlacesModel;
  isBookable = false;
  isLoading = false;
  private placesSub: Subscription;

  constructor(private route: ActivatedRoute,
              private placesService: PlacesService,
              private navController: NavController,
              private modalController: ModalController,
              private actionSheetController: ActionSheetController,
              private bookingService: BookingService,
              private loading: LoadingController,
              private authService: AuthService,
              private alertCtrl: AlertController,
              private router: Router,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;
      this.placesSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.isBookable = place.userId !== this.authService.userId;
        this.isLoading = false;
      }, error => {
          this.alertCtrl.create({
            header: 'Error',
            message: 'Error try again.',
            buttons: [{
              text: 'Okay',
              handler: () => {
                this.router.navigate(['/places/tabs/discover']);
              }
            }]
          }).then(el => {
            el.present();
          });
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

  onShowFullMap() {
    this.modalCtrl
        .create({
          component: MapModalComponent,
          componentProps: {
            center: {
              lat: this.place.location.lat,
              lng: this.place.location.lng
            },
            selectable: false,
            closeButtonText: 'Close',
            title: this.place.location.address
          }
        })
        .then(modalEl => {
          modalEl.present();
        });
  }
}
