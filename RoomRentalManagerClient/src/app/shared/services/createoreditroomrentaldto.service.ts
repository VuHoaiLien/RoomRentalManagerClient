/* Auto-generated from service-proxies.ts */

import { RoomStatus, RoomType } from "./roomrentalfilterdtopagedrequestdto.service";

export class CreateOrEditRoomRentalDto implements ICreateOrEditRoomRentalDto {
    id?: number | undefined;
    roomNumber?: string | undefined;
    roomType?: RoomType;
    price?: string | undefined;
    statusRoom?: RoomStatus;
    note?: string | undefined;
    area?: string | undefined;
    imagesDescription?: string[] | undefined;

    constructor(data?: ICreateOrEditRoomRentalDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (this as any)[property] = (data as any)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.roomNumber = _data["roomNumber"];
            this.roomType = _data["roomType"];
            this.price = _data["price"];
            this.statusRoom = _data["statusRoom"];
            this.note = _data["note"];
            this.area = _data["area"];
            if (Array.isArray(_data["imagesDescription"])) {
                this.imagesDescription = [] as any;
                for (let item of _data["imagesDescription"])
                    this.imagesDescription!.push(item);
            }
        }
    }

    static fromJS(data: any): CreateOrEditRoomRentalDto {
        data = typeof data === 'object' ? data : {};
        let result = new CreateOrEditRoomRentalDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["roomNumber"] = this.roomNumber;
        data["roomType"] = this.roomType;
        data["price"] = this.price;
        data["statusRoom"] = this.statusRoom;
        data["note"] = this.note;
        data["area"] = this.area;
        if (Array.isArray(this.imagesDescription)) {
            data["imagesDescription"] = [];
            for (let item of this.imagesDescription)
                data["imagesDescription"].push(item);
        }
        return data;
    }
}

export interface ICreateOrEditRoomRentalDto {
    id?: number | undefined;
    roomNumber?: string | undefined;
    roomType?: RoomType;
    price?: string | undefined;
    statusRoom?: RoomStatus;
    note?: string | undefined;
    area?: string | undefined;
    imagesDescription?: string[] | undefined;
}


