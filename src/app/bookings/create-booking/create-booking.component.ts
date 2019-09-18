import {Component, Input, OnInit} from '@angular/core';
import {PlacesModel} from '../../places/places.model';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {

  @Input() selectedPlace: PlacesModel;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  onBookPlace() {
    this.modalController.dismiss({message: 'Dummy message!'}, 'confirm');
  }
}
