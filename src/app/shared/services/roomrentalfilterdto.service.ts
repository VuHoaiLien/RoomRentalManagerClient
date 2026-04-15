/* Auto-generated from service-proxies.ts */

import { RoomStatus, RoomType } from "./roomrentalfilterdtopagedrequestdto.service";

export class RoomRentalFilterDto implements IRoomRentalFilterDto {
    roomNumber?: string | undefined;
    roomType?: RoomType;
    priceStart?: string | undefined;
    priceEnd?: string | undefined;
    statusRoom?: RoomStatus;
    note?: string | undefined;
    areaStart?: string | undefined;
    areaEnd?: string | undefined;
    createdDate?: Date | undefined;
    updatedDate?: Date | undefined;
    creatorUser?: string | undefined;
    lastUpdateUser?: string | undefined;

    constructor(data?: IRoomRentalFilterDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (this as any)[property] = (data as any)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.roomNumber = _data["roomNumber"];
            this.roomType = _data["roomType"];
            this.priceStart = _data["priceStart"];
            this.priceEnd = _data["priceEnd"];
            this.statusRoom = _data["statusRoom"];
            this.note = _data["note"];
            this.areaStart = _data["areaStart"];
            this.areaEnd = _data["areaEnd"];
            this.createdDate = _data["createdDate"] ? new Date(_data["createdDate"].toString()) : undefined as any;
            this.updatedDate = _data["updatedDate"] ? new Date(_data["updatedDate"].toString()) : undefined as any;
            this.creatorUser = _data["creatorUser"];
            this.lastUpdateUser = _data["lastUpdateUser"];
        }
    }

    static fromJS(data: any): RoomRentalFilterDto {
        data = typeof data === 'object' ? data : {};
        let result = new RoomRentalFilterDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["roomNumber"] = this.roomNumber;
        data["roomType"] = this.roomType;
        data["priceStart"] = this.priceStart;
        data["priceEnd"] = this.priceEnd;
        data["statusRoom"] = this.statusRoom;
        data["note"] = this.note;
        data["areaStart"] = this.areaStart;
        data["areaEnd"] = this.areaEnd;
        data["createdDate"] = this.createdDate ? this.createdDate.toISOString() : undefined as any;
        data["updatedDate"] = this.updatedDate ? this.updatedDate.toISOString() : undefined as any;
        data["creatorUser"] = this.creatorUser;
        data["lastUpdateUser"] = this.lastUpdateUser;
        return data;
    }
}

export interface IRoomRentalFilterDto {
    roomNumber?: string | undefined;
    roomType?: RoomType;
    priceStart?: string | undefined;
    priceEnd?: string | undefined;
    statusRoom?: RoomStatus;
    note?: string | undefined;
    areaStart?: string | undefined;
    areaEnd?: string | undefined;
    createdDate?: Date | undefined;
    updatedDate?: Date | undefined;
    creatorUser?: string | undefined;
    lastUpdateUser?: string | undefined;
}


