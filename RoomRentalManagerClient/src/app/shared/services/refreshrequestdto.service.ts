/* Auto-generated from service-proxies.ts */

export class RefreshRequestDto implements IRefreshRequestDto {
    userId?: number;
    refreshToken?: string | undefined;
    rememberMe?: boolean;

    constructor(data?: IRefreshRequestDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (this as any)[property] = (data as any)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.userId = _data["userId"];
            this.refreshToken = _data["refreshToken"];
            this.rememberMe = _data["rememberMe"];
        }
    }

    static fromJS(data: any): RefreshRequestDto {
        data = typeof data === 'object' ? data : {};
        let result = new RefreshRequestDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["userId"] = this.userId;
        data["refreshToken"] = this.refreshToken;
        data["rememberMe"] = this.rememberMe;
        return data;
    }
}

export interface IRefreshRequestDto {
    userId?: number;
    refreshToken?: string | undefined;
    rememberMe?: boolean;
}


