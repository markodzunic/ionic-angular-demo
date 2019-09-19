import { Component, OnInit } from '@angular/core';
import {PlacesService} from '../places.service';
import {PlacesModel} from '../places.model';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: PlacesModel[];

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
  }

    onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
      console.log(event.detail);
    }
}
