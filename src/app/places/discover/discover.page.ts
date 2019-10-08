import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlacesService} from '../places.service';
import {PlacesModel} from '../places.model';
import { SegmentChangeEventDetail } from '@ionic/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {LoadingController} from '@ionic/angular';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: PlacesModel[];
  relevantPlaces: PlacesModel[];
  isLoading = false;
  private placesSub: Subscription;

  constructor(private placesService: PlacesService,
              private authService: AuthService,
              private loading: LoadingController) { }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.loading.create({message: 'loading....'}).then(el => {
      el.present();
      this.placesService.fetchPlaces().subscribe(() => {
        this.isLoading = false;
        el.dismiss();
      });
    });
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    this.authService.userId.pipe(take(1)).subscribe(userId => {
      if (event.detail.value === 'all') {
        this.relevantPlaces = this.loadedPlaces;
      } else {
        this.relevantPlaces = this.loadedPlaces.filter(place => {
          return place.userId !== userId;
        });
      }
    });
  }
}
