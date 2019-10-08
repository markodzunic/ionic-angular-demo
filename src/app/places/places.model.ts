import {PlaceLocation} from './location.model';

export class PlacesModel {
    constructor(public id: string,
                public title: string,
                public description: string,
                public image: string,
                public price: number,
                public availableFrom: Date,
                public availableTo: Date,
                public userId: unknown,
                public location: PlaceLocation) {

    }
}
