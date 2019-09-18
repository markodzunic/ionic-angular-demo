import { Component, OnInit } from '@angular/core';
import {PlacesModel} from '../places.model';
import {PlacesService} from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offers: PlacesModel[];

  constructor(private offerService: PlacesService) { }

  ngOnInit() {
    this.offers = this.offerService.places;
  }

}
