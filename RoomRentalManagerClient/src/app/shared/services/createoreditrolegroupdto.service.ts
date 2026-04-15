/* Auto-generated from service-proxies.ts */

import { RoleDto } from "./roledto.service";

export class CreateOrEditRoleGroupDto implements ICreateOrEditRoleGroupDto {
    id?: number | undefined;
    name?: string | undefined;
    active?: boolean;
    descriptions?: string | undefined;
    roleDtos?: RoleDto[] | undefined;

    constructor(data?: ICreateOrEditRoleGroupDto) {
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
            this.active = _data["active"];
            this.descriptions = _data["descriptions"];
            if (Array.isArray(_data["roleDtos"])) {
                this.roleDtos = [] as any;
                for (let item of _data["roleDtos"])
                    this.roleDtos!.push(RoleDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): CreateOrEditRoleGroupDto {
        data = typeof data === 'object' ? data : {};
        let result = new CreateOrEditRoleGroupDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["active"] = this.active;
        data["descriptions"] = this.descriptions;
        if (Array.isArray(this.roleDtos)) {
            data["roleDtos"] = [];
            for (let item of this.roleDtos)
                data["roleDtos"].push(item ? item.toJSON() : undefined as any);
        }
        return data;
    }
}

export interface ICreateOrEditRoleGroupDto {
    id?: number | undefined;
    name?: string | undefined;
    active?: boolean;
    descriptions?: string | undefined;
    roleDtos?: RoleDto[] | undefined;
}


