/* Auto-generated from service-proxies.ts */

import { RoleGroupDto } from "./rolegroupdto.service";

export class RoleGroupDtoPagedResultDto implements IRoleGroupDtoPagedResultDto {
    listItem?: RoleGroupDto[] | undefined;
    totalCount?: number;

    constructor(data?: IRoleGroupDtoPagedResultDto) {
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
                    this.listItem!.push(RoleGroupDto.fromJS(item));
            }
            this.totalCount = _data["totalCount"];
        }
    }

    static fromJS(data: any): RoleGroupDtoPagedResultDto {
        data = typeof data === 'object' ? data : {};
        let result = new RoleGroupDtoPagedResultDto();
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

export interface IRoleGroupDtoPagedResultDto {
    listItem?: RoleGroupDto[] | undefined;
    totalCount?: number;
}


