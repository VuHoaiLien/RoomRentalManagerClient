/* Auto-generated from service-proxies.ts */

import { RoomStatus, RoomType } from "./roomrentalfilterdtopagedrequestdto.service";

export class RoomRentalDto implements IRoomRentalDto {
    id?: number;
    roomNumber?: number;
    roomType?: RoomType;
    price?: number;
    statusRoom?: RoomStatus;
    note?: string | undefined;
    area?: number;
    imagesDescription?: string[] | undefined;
    createdDate?: Date;
    updatedDate?: Date;
    creatorUser?: string | undefined;
    lastUpdateUser?: string | undefined;

    constructor(data?: IRoomRentalDto) {
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
            this.createdDate = _data["createdDate"] ? new Date(_data["createdDate"].toString()) : undefined as any;
            this.updatedDate = _data["updatedDate"] ? new Date(_data["updatedDate"].toString()) : undefined as any;
            this.creatorUser = _data["creatorUser"];
            this.lastUpdateUser = _data["lastUpdateUser"];
        }
    }

    static fromJS(data: any): RoomRentalDto {
        data = typeof data === 'object' ? data : {};
        let result = new RoomRentalDto();
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
        data["createdDate"] = this.createdDate ? this.createdDate.toISOString() : undefined as any;
        data["updatedDate"] = this.updatedDate ? this.updatedDate.toISOString() : undefined as any;
        data["creatorUser"] = this.creatorUser;
        data["lastUpdateUser"] = this.lastUpdateUser;
        return data;
    }
}

export interface IRoomRentalDto {
    id?: number;
    roomNumber?: number;
    roomType?: RoomType;
    price?: number;
    statusRoom?: RoomStatus;
    note?: string | undefined;
    area?: number;
    imagesDescription?: string[] | undefined;
    createdDate?: Date;
    updatedDate?: Date;
    creatorUser?: string | undefined;
    lastUpdateUser?: string | undefined;
}


