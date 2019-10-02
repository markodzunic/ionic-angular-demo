import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlacesModel} from '../places.model';
import {PlacesService} from '../places.service';
import {IonItemSliding} from '@ionic/angular';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: PlacesModel[];
  placesSub: Subscription;

  constructor(private offerService: PlacesService,
              private router: Router) { }

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

  onEdit(id: string, sliding: IonItemSliding) {
      sliding.close();
      this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', id]);
      console.log('Editing');
    }
}
