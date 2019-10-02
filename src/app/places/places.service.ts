import { Injectable } from '@angular/core';
import {PlacesModel} from './places.model';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject} from 'rxjs';
import {take, map, tap, delay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private placesData = new BehaviorSubject<PlacesModel[]>(
      [
        {
          id: 'p1',
          title: 'Manhattan House',
          description: 'Hear of New York',
          image: 'https://media-cdn.tripadvisor.com/media/photo-p/12/9b/cd/3c/manhattn-s-burgers-beurs.jpg',
          price: 145,
          availableFrom: new Date('2019-01-01'),
          availableTo: new Date('2019-12-31'),
          userId: 'aaa'
        },
        {
          id: 'p2',
          title: 'LA House',
          description: 'Hear of Los Angeles',
          image: 'https://media-cdn.tripadvisor.com/media/photo-p/12/9b/cd/3c/manhattn-s-burgers-beurs.jpg',
          price: 666,
          availableFrom: new Date('2019-01-01'),
          availableTo: new Date('2019-12-31'),
          userId: 'aaa'
        },
        {
          id: 'p3',
          title: 'Paris House',
          description: 'Hear of Los Paris',
          image: 'https://media-cdn.tripadvisor.com/media/photo-p/12/9b/cd/3c/manhattn-s-burgers-beurs.jpg',
          price: 345.99,
          availableFrom: new Date('2019-01-01'),
          availableTo: new Date('2019-12-31'),
          userId: 'aaa'
        }
      ]
  );

  constructor(private authService: AuthService) {

  }

  get places() {
    return this.placesData.asObservable();
  }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return {...places.find(p => p.id === id)};
    }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new PlacesModel(
        Math.random().toString(),
        title,
        description,
        'https://media-cdn.tripadvisor.com/media/photo-p/12/9b/cd/3c/manhattn-s-burgers-beurs.jpg',
        price,
        dateFrom,
        dateTo,
        this.authService.userId
    );
    return this.places.pipe(take(1), delay(1000), tap( places => {
      this.placesData.next(places.concat(newPlace));
    }));
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(take(1), delay(1000), tap(places => {
      const updatedPlaceIndex = places.findIndex(pl => {
        return pl.id === placeId;
      });
      const updatedPlaces = [...places];
      const oldPlace = updatedPlaces[updatedPlaceIndex];
      updatedPlaces[updatedPlaceIndex] = new PlacesModel(
          oldPlace.id,
          title,
          description,
          oldPlace.image,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
      );
      this.placesData.next(updatedPlaces);
    }));
  }
}
