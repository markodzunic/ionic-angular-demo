import { Injectable } from '@angular/core';
import {PlacesModel} from './places.model';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject, of} from 'rxjs';
import {take, map, tap, delay, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {PlaceLocation} from './location.model';

interface PlaceData {
   title: string;
   description: string;
   image: string;
   price: number;
   availableFrom: Date;
   availableTo: Date;
   userId: string;
   location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private placesData = new BehaviorSubject<PlacesModel[]>([]);

  constructor(private authService: AuthService,
              private http: HttpClient) {
  }

  get places() {
    return this.placesData.asObservable();
  }

  getPlace(id: string) {
      return this.authService.token.pipe(take(1), switchMap(token => {
          return this.http.get<PlaceData>(`https://ionic-angular-demo-88359.firebaseio.com/offer-places/${id}.json?auth=${token}`);
      }), map(placeData => {
      return new PlacesModel(id, placeData.title, placeData.description, placeData.image, placeData.price, placeData.availableFrom,
          placeData.availableTo, placeData.userId, placeData.location);
    }));
  }

  fetchPlaces() {
      return this.authService.token.pipe(take(1), switchMap(token => {
          return this.http.get<{[key: string]: PlaceData}>(`https://ionic-angular-demo-88359.firebaseio.com/offer-places.json?${token}`);
      }), map(resData => {
              const places = [];
              for (const key in resData) {
                if (resData.hasOwnProperty(key)) {
                  places.push(new PlacesModel(key, resData[key].title, resData[key].description, resData[key].image, resData[key].price,
                      new Date(resData[key].availableFrom), new Date(resData[key].availableTo), resData[key].userId,
                      resData[key].location));
                }
              }
              return places;
            }),
            take(1),
            tap(places => {
              this.placesData.next(places);
            })
        );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);
    return this.authService.token.pipe(take(1), switchMap(token => {
          return this.http.post<{imageUrl: string, imagePath: string}>(
              `https://us-central1-ionic-angular-demo-88359.cloudfunctions.net/storeImage`,
              uploadData,
              {
                  headers: {Authorization: 'Bearer ' + token}
              }
          );
      }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date, location: PlaceLocation, imageUrl: string) {
    let generatedId: string;
    let newPlace: PlacesModel;
    let fetchedUserId: string;
    return this.authService.userId.pipe(take(1), switchMap(userId => {
            fetchedUserId = userId;
            return this.authService.token;
        }), take(1), switchMap(token => {
        if (!fetchedUserId) {
            throw new Error('Not found id');
        }
        newPlace = new PlacesModel(
            Math.random().toString(),
            title,
            description,
            imageUrl,
            price,
            dateFrom,
            dateTo,
            fetchedUserId,
            location
        );
        return this.http.post<{name: string}>(
            `https://ionic-angular-demo-88359.firebaseio.com/offer-places.json?auth=${token}`, { ...newPlace, id: null });
    }), switchMap(resData => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap( places => {
          newPlace.id = generatedId;
          this.placesData.next(places.concat(newPlace));
        })
    );
  }

    updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: PlacesModel[];
    let fetchedToken: string;

    return this.authService.token.pipe(take(1), switchMap(token => {
        fetchedToken = token;
        return this.places;
    }), take(1), switchMap(places => {
        if (!places && places.length <= 0) {
            return this.fetchPlaces();
        } else {
            return of(places);
        }
    }), switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => {
            return pl.id === placeId;
        });
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new PlacesModel(
            oldPlace.id,
            title,
            description,
            oldPlace.image,
            oldPlace.price,
            oldPlace.availableFrom,
            oldPlace.availableTo,
            oldPlace.userId,
            oldPlace.location);
        return this.http.put(`https://ionic-angular-demo-88359.firebaseio.com/offer-places/${placeId}.json?auth=${fetchedToken}`,
          {
            ...updatedPlaces[updatedPlaceIndex], id: null
          });
    }), tap(() => {
      this.placesData.next(updatedPlaces);
    }));
  }
}
