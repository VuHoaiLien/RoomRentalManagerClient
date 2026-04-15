/* Auto-generated from service-proxies.ts */

import { UserDto } from "./userdto.service";

export class UserDtoPagedResultDto implements IUserDtoPagedResultDto {
    listItem?: UserDto[] | undefined;
    totalCount?: number;

    constructor(data?: IUserDtoPagedResultDto) {
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
                    this.listItem!.push(UserDto.fromJS(item));
            }
            this.totalCount = _data["totalCount"];
        }
    }

    static fromJS(data: any): UserDtoPagedResultDto {
        data = typeof data === 'object' ? data : {};
        let result = new UserDtoPagedResultDto();
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

export interface IUserDtoPagedResultDto {
    listItem?: UserDto[] | undefined;
    totalCount?: number;
}


