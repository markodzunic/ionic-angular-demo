import { Component, OnInit } from '@angular/core';
import {PlacesModel} from '../../places.model';
import {ActivatedRoute} from '@angular/router';
import {PlacesService} from '../../places.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  offer: PlacesModel;

  constructor(private route: ActivatedRoute,
              private navController: NavController,
              private placeService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }
      this.offer = this.placeService.getPlace(paramMap.get('placeId'));
    });
  }
}
