import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PlacesModel} from '../../places/places.model';
import {ModalController} from '@ionic/angular';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {

  @Input() selectedPlace: PlacesModel;
  @Input() selectedMode: 'select' | 'random';
  // @ts-ignore
  @ViewChild('f') form: NgForm;

  startDate: string;
  endDate: string;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    const availableForm = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    if (this.selectedMode === 'random') {
      this.startDate = new Date(availableForm.getTime() + Math.random() *
          (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableForm.getTime())).toISOString();
      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() *
          (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime())).toISOString();
    }
  }

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  onBookPlace() {
    if (!this.form.valid || !this.dateValid()) {
      return;
    }
    this.modalController.dismiss({bookingData:
          {
            firstName: this.form.value['first-name'],
            lastName: this.form.value['last-name'],
            guestNumber: this.form.value['guest-number'],
            from: this.form.value['date-from'],
            to: this.form.value['date-to'],
          }
      }, 'confirm');
  }

  dateValid() {
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);
    return endDate > startDate;
  }
}
