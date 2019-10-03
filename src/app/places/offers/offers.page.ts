import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlacesModel} from '../places.model';
import {PlacesService} from '../places.service';
import {IonItemSliding, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: PlacesModel[];
  isLoading = false;
  placesSub: Subscription;

  constructor(private offerService: PlacesService,
              private router: Router,
              private loading: LoadingController) { }

  ngOnInit() {
    this.placesSub = this.offerService.places.subscribe(places => {
      this.offers = places;
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
      this.offerService.fetchPlaces().subscribe(() => {
        this.isLoading = false;
        el.dismiss();
      });
    });
  }

  onEdit(id: string, sliding: IonItemSliding) {
      sliding.close();
      this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', id]);
      console.log('Editing');
    }
}
