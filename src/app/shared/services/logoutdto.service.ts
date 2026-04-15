/* Auto-generated from service-proxies.ts */

export class LogoutDto implements ILogoutDto {
    refreshToken?: string | undefined;

    constructor(data?: ILogoutDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (this as any)[property] = (data as any)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.refreshToken = _data["refreshToken"];
        }
    }

    static fromJS(data: any): LogoutDto {
        data = typeof data === 'object' ? data : {};
        let result = new LogoutDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["refreshToken"] = this.refreshToken;
        return data;
    }
}

export interface ILogoutDto {
    refreshToken?: string | undefined;
}


