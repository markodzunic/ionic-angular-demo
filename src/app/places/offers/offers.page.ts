import { Component, OnInit } from '@angular/core';
import {PlacesModel} from '../places.model';
import {PlacesService} from '../places.service';
import {IonItemSliding} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offers: PlacesModel[];

  constructor(private offerService: PlacesService,
              private router: Router) { }

  ngOnInit() {
    this.offers = this.offerService.places;
  }

    onEdit(id: string, sliding: IonItemSliding) {
      sliding.close();
      this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', id]);
      console.log('Editing');
    }
}
