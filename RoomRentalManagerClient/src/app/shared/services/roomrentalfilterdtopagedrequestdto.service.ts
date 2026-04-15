/* Auto-generated from service-proxies.ts */

import { RoomRentalFilterDto } from "./roomrentalfilterdto.service";

export class RoomRentalFilterDtoPagedRequestDto implements IRoomRentalFilterDtoPagedRequestDto {
    page?: number;
    pageSize?: number;
    sortBy?: string | undefined;
    sortOrder?: string | undefined;
    filter?: RoomRentalFilterDto;

    constructor(data?: IRoomRentalFilterDtoPagedRequestDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (this as any)[property] = (data as any)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.page = _data["page"];
            this.pageSize = _data["pageSize"];
            this.sortBy = _data["sortBy"];
            this.sortOrder = _data["sortOrder"];
            this.filter = _data["filter"] ? RoomRentalFilterDto.fromJS(_data["filter"]) : undefined as any;
        }
    }

    static fromJS(data: any): RoomRentalFilterDtoPagedRequestDto {
        data = typeof data === 'object' ? data : {};
        let result = new RoomRentalFilterDtoPagedRequestDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["page"] = this.page;
        data["pageSize"] = this.pageSize;
        data["sortBy"] = this.sortBy;
        data["sortOrder"] = this.sortOrder;
        data["filter"] = this.filter ? this.filter.toJSON() : undefined as any;
        return data;
    }
}

export interface IRoomRentalFilterDtoPagedRequestDto {
    page?: number;
    pageSize?: number;
    sortBy?: string | undefined;
    sortOrder?: string | undefined;
    filter?: RoomRentalFilterDto;
}

export enum RoomStatus {
    _1 = 1,
    _2 = 2,
    _3 = 3,
    _4 = 4,
}

export enum RoomType {
    _1 = 1,
    _2 = 2,
    _3 = 3,
    _4 = 4,
}


