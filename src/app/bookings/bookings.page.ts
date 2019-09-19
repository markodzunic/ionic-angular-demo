import { Component, OnInit } from '@angular/core';
import {BookingService} from './booking.service';
import {BookingsModel} from './bookings.model';
import {IonItemSliding} from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {

  constructor(private bookingsService: BookingService) { }
  loadedBookings: BookingsModel[];

  ngOnInit() {
    this.loadedBookings = this.bookingsService.bookings;
  }

  onCancelBooking(bookingId: string, sliding: IonItemSliding) {
    sliding.close();
  }
}
