import {Component, OnDestroy, OnInit} from '@angular/core';
import {BookingService} from './booking.service';
import {BookingsModel} from './bookings.model';
import {IonItemSliding, LoadingController} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  constructor(private bookingsService: BookingService,
              private loading: LoadingController) { }

  loadedBookings: BookingsModel[];
  private bookingSub: Subscription;

  ngOnInit() {
    this.bookingSub = this.bookingsService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }
  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }

  onCancelBooking(bookingId: string, sliding: IonItemSliding) {
    sliding.close();
    this.loading.create({message: 'canceling....'}).then(el => {
      el.present();
      this.bookingsService.cancelBooking(bookingId).subscribe(() => {
        el.dismiss();
      });
    });
  }
}
