import {Injectable} from '@angular/core';
import {BookingsModel} from './bookings.model';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {delay, map, switchMap, take, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {PlacesModel} from '../places/places.model';

interface BookingsData {
    placeId: string;
    userId: string;
    placeTitle: string;
    firstName: string;
    lastName: string;
    guestNumber: number;
    placeImage: string;
    bookedFrom: Date;
    bookedTo: Date;
}

@Injectable({providedIn: 'root'})
export class BookingService {
    private bookingsData = new BehaviorSubject<BookingsModel[]>([]);

    constructor(private authService: AuthService,
                private http: HttpClient) {}

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
        let generatedId: string;
        let newBooking: BookingsModel;
        let fechedUserId: string;

        return this.authService.userId.pipe(take(1), switchMap(userId => {
            if (!userId) {
                throw new Error('Not found id');
            }
            fechedUserId = userId;
            return this.authService.token;
        }), take(1), switchMap(token => {
            newBooking = new BookingsModel(
                Math.random().toString(),
                fechedUserId,
                placeId,
                placeTitle,
                firstName,
                lastName,
                guestNumber,
                placeImage,
                bookedFrom,
                bookedTo
            );
            return this.http.post<{name: string}>(
                `https://ionic-angular-demo-88359.firebaseio.com/bookings.json?auth=${token}`, { ...newBooking, id: null});
        }), switchMap(resData => {
            generatedId = resData.name;
            return this.bookings;
        }), take(1), tap(bookings => {
            newBooking.id = generatedId;
            this.bookingsData.next(bookings.concat(newBooking));
        }));
    }

    fetchBookings() {
        let fetchedUserId: string;

        return this.authService.userId.pipe(take(1), switchMap(userId => {
            if (!userId) {
                throw new Error('Not found id');
            }
            fetchedUserId = userId;
            return this.authService.token;
        }), take(1), switchMap(token => {
            return this.http.get<{[key: string]: BookingsData}>
                (`https://ionic-angular-demo-88359.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`);
        }), map(resData => {
                    const places = [];
                    for (const key in resData) {
                        if (resData.hasOwnProperty(key)) {
                            places.push(
                                new BookingsModel(key, resData[key].placeId, resData[key].userId, resData[key].placeTitle,
                                    resData[key].firstName, resData[key].lastName, resData[key].guestNumber,
                                    resData[key].placeImage, new Date(resData[key].bookedFrom), new Date(resData[key].bookedTo)));
                        }
                    }
                    return places;
                }),
                take(1),
                tap(places => {
                    this.bookingsData.next(places);
                })
            );
    }
    cancelBooking(bookingId: string) {
        return this.authService.token.pipe(take(1), switchMap(token => {
            return this.http.delete(`https://ionic-angular-demo-88359.firebaseio.com/bookings/${bookingId}.json?auth=${token}`);
        }), switchMap(() => {
            return this.bookings;
        }), take(1), tap(bookings => {
            this.bookingsData.next(bookings.filter(b => {
                return b.id !== bookingId;
            }));
        }));
    }
}
