export class BookingsModel {
    constructor(public id: string,
                public placeId: string,
                public userId: string,
                public placeTitle: string,
                public firstName: string,
                public lastName: string,
                public guestNumber: number,
                public placeImage: string,
                public bookedFrom: Date,
                public bookedTo: Date) {

    }
}
