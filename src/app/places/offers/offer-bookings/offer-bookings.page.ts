import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import {PlacesService} from '../../places.service';
import {ActivatedRoute} from '@angular/router';
import {PlacesModel} from '../../places.model';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {
  place: PlacesModel;

  constructor(private route: ActivatedRoute,
              private navController: NavController,
              private placesService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
    });
  }

}
