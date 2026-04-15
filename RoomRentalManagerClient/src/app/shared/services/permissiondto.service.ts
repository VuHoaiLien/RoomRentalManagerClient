/* Auto-generated from service-proxies.ts */

export class PermissionDto implements IPermissionDto {
    id?: number;
    name?: string | undefined;

    constructor(data?: IPermissionDto) {
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
        }
    }

    static fromJS(data: any): PermissionDto {
        data = typeof data === 'object' ? data : {};
        let result = new PermissionDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        return data;
    }
}

export interface IPermissionDto {
    id?: number;
    name?: string | undefined;
}


