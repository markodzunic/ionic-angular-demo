import {Injectable} from '@angular/core';
import {BookingsModel} from './bookings.model';

@Injectable({providedIn: 'root'})
export class BookingService {
    private bookingsData: BookingsModel[] = [
        {
            id: 'b1',
            placeId: 'p1',
            userId: 'u1',
            placeTitle: 'Mension',
            guestNumber: 12
        },
        {
            id: 'b2',
            placeId: 'p1',
            userId: 'u1',
            placeTitle: 'Mension2',
            guestNumber: 4
        },
    ];

    constructor() {}

    get bookings() {
        return [...this.bookingsData];
    }
}
