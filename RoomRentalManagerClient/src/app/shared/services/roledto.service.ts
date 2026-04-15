/* Auto-generated from service-proxies.ts */

import { PermissionDto } from "./permissiondto.service";

export class RoleDto implements IRoleDto {
    id?: number;
    name?: string | undefined;
    permissions?: PermissionDto[] | undefined;

    constructor(data?: IRoleDto) {
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
            this.name = _data["name"];
            if (Array.isArray(_data["permissions"])) {
                this.permissions = [] as any;
                for (let item of _data["permissions"])
                    this.permissions!.push(PermissionDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): RoleDto {
        data = typeof data === 'object' ? data : {};
        let result = new RoleDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        if (Array.isArray(this.permissions)) {
            data["permissions"] = [];
            for (let item of this.permissions)
                data["permissions"].push(item ? item.toJSON() : undefined as any);
        }
        return data;
    }
}

export interface IRoleDto {
    id?: number;
    name?: string | undefined;
    permissions?: PermissionDto[] | undefined;
}


