import { Injectable } from '@angular/core';
import {PlacesModel} from './places.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private placesData: PlacesModel[] = [
    {
      id: 'p1',
      title: 'Manhattan House',
      description: 'Hear of New York',
      image: 'https://media-cdn.tripadvisor.com/media/photo-p/12/9b/cd/3c/manhattn-s-burgers-beurs.jpg',
      price: 145,
      availableFrom: new Date('2019-01-01'),
      availableTo: new Date('2019-12-31')
    },
    {
      id: 'p2',
      title: 'LA House',
      description: 'Hear of Los Angeles',
      image: 'https://media-cdn.tripadvisor.com/media/photo-p/12/9b/cd/3c/manhattn-s-burgers-beurs.jpg',
      price: 666,
      availableFrom: new Date('2019-01-01'),
      availableTo: new Date('2019-12-31')
    },
    {
      id: 'p3',
      title: 'Paris House',
      description: 'Hear of Los Paris',
      image: 'https://media-cdn.tripadvisor.com/media/photo-p/12/9b/cd/3c/manhattn-s-burgers-beurs.jpg',
      price: 345.99,
      availableFrom: new Date('2019-01-01'),
      availableTo: new Date('2019-12-31')
    }
  ];

  get places() {
    return [...this.placesData];
  }

  getPlace(id: string) {
    return {...this.placesData.find(p => p.id === id)};
  }

  constructor() {}
}
