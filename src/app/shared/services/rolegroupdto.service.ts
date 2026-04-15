/* Auto-generated from service-proxies.ts */

export class RoleGroupDto implements IRoleGroupDto {
    id?: number;
    name?: string | undefined;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    creatorUser?: string | undefined;
    lastUpdateUser?: string | undefined;
    descriptions?: string | undefined;

    constructor(data?: IRoleGroupDto) {
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
            this.createdAt = _data["createdAt"] ? new Date(_data["createdAt"].toString()) : undefined as any;
            this.updatedAt = _data["updatedAt"] ? new Date(_data["updatedAt"].toString()) : undefined as any;
            this.creatorUser = _data["creatorUser"];
            this.lastUpdateUser = _data["lastUpdateUser"];
            this.descriptions = _data["descriptions"];
        }
    }

    static fromJS(data: any): RoleGroupDto {
        data = typeof data === 'object' ? data : {};
        let result = new RoleGroupDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["active"] = this.active;
        data["createdAt"] = this.createdAt ? this.createdAt.toISOString() : undefined as any;
        data["updatedAt"] = this.updatedAt ? this.updatedAt.toISOString() : undefined as any;
        data["creatorUser"] = this.creatorUser;
        data["lastUpdateUser"] = this.lastUpdateUser;
        data["descriptions"] = this.descriptions;
        return data;
    }
}

export interface IRoleGroupDto {
    id?: number;
    name?: string | undefined;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    creatorUser?: string | undefined;
    lastUpdateUser?: string | undefined;
    descriptions?: string | undefined;
}


