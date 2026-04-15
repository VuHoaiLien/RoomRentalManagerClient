/* Auto-generated from service-proxies.ts */

import { RoomRentalDto } from "./roomrentaldto.service";

export class RoomRentalDtoPagedResultDto implements IRoomRentalDtoPagedResultDto {
    listItem?: RoomRentalDto[] | undefined;
    totalCount?: number;

    constructor(data?: IRoomRentalDtoPagedResultDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (this as any)[property] = (data as any)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            if (Array.isArray(_data["listItem"])) {
                this.listItem = [] as any;
                for (let item of _data["listItem"])
                    this.listItem!.push(RoomRentalDto.fromJS(item));
            }
            this.totalCount = _data["totalCount"];
        }
    }

    static fromJS(data: any): RoomRentalDtoPagedResultDto {
        data = typeof data === 'object' ? data : {};
        let result = new RoomRentalDtoPagedResultDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        if (Array.isArray(this.listItem)) {
            data["listItem"] = [];
            for (let item of this.listItem)
                data["listItem"].push(item ? item.toJSON() : undefined as any);
        }
        data["totalCount"] = this.totalCount;
        return data;
    }
}

export interface IRoomRentalDtoPagedResultDto {
    listItem?: RoomRentalDto[] | undefined;
    totalCount?: number;
}


