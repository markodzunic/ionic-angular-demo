import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlacesModel} from '../../places.model';
import {ActivatedRoute, Router} from '@angular/router';
import {PlacesService} from '../../places.service';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  offer: PlacesModel;
  form: FormGroup;
  isLoading = false;
  placeId: string | boolean;
  private placesSub: Subscription;

  constructor(private route: ActivatedRoute,
              private navController: NavController,
              private placeService: PlacesService,
              private router: Router,
              private loading: LoadingController,
              private alertCtrl: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placesSub = this.placeService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.offer = place;
        this.form = new FormGroup({
          title: new FormControl(this.offer.title, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          description: new FormControl(this.offer.description, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)]
          }),
        });
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'Error',
          message: 'error occured',
          buttons: [{text: 'Okay', handler: () => {
            this.router.navigate(['/places/tabs/offers']);
            }}]
        }).then(el => {
          el.present();
        });
      });
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loading.create({
      message: 'updating place....'
    }).then(loadingEl => {
      loadingEl.present();
      this.placeService.updatePlace(this.offer.id, this.form.value.title, this.form.value.description).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
      });
    });
  }
}
