/* Auto-generated from service-proxies.ts */

export class GoogleLoginRequestDto implements IGoogleLoginRequestDto {
    idToken?: string | undefined;
    rememberMe?: boolean;

    constructor(data?: IGoogleLoginRequestDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (this as any)[property] = (data as any)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.idToken = _data["idToken"];
            this.rememberMe = _data["rememberMe"];
        }
    }

    static fromJS(data: any): GoogleLoginRequestDto {
        data = typeof data === 'object' ? data : {};
        let result = new GoogleLoginRequestDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["idToken"] = this.idToken;
        data["rememberMe"] = this.rememberMe;
        return data;
    }
}

export interface IGoogleLoginRequestDto {
    idToken?: string | undefined;
    rememberMe?: boolean;
}


