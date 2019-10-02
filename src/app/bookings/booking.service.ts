import {Injectable} from '@angular/core';
import {BookingsModel} from './bookings.model';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {delay, take, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class BookingService {
    private bookingsData = new BehaviorSubject<BookingsModel[]>([]);

    constructor(private authService: AuthService) {}

    get bookings() {
        return this.bookingsData.asObservable();
    }

    addBooking(
        placeId: string,
        placeTitle: string,
        placeImage: string,
        firstName: string,
        lastName: string,
        guestNumber: number,
        bookedFrom: Date,
        bookedTo: Date) {
        const newBooking = new BookingsModel(
            Math.random().toString(),
            this.authService.userId,
            placeId,
            placeTitle,
            firstName,
            lastName,
            guestNumber,
            placeImage,
            bookedFrom,
            bookedTo
        );

        return this.bookings.pipe(take(1), delay(1000), tap( bookings => {
            this.bookingsData.next(bookings.concat(newBooking));
        }));
    }

    cancelBooking(bookingId: string) {
        return this.bookings.pipe(take(1), delay(1000), tap( bookings => {
            this.bookingsData.next(bookings.filter(b => {
                return b.id !== bookingId;
            }));
        }));
    }
}
