/* Auto-generated from service-proxies.ts */

import { UserDto } from "./userdto.service";

export class LoginResponseDto implements ILoginResponseDto {
    message?: string | undefined;
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
    user?: UserDto;
    expiresAt?: Date;
    expiresIn?: number;
    refreshExpiresAt?: Date | undefined;
    refreshExpiresIn?: number | undefined;
    roleGroupPermissions?: string[] | undefined;

    constructor(data?: ILoginResponseDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (this as any)[property] = (data as any)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.message = _data["message"];
            this.accessToken = _data["accessToken"];
            this.refreshToken = _data["refreshToken"];
            this.user = _data["user"] ? UserDto.fromJS(_data["user"]) : undefined as any;
            this.expiresAt = _data["expiresAt"] ? new Date(_data["expiresAt"].toString()) : undefined as any;
            this.expiresIn = _data["expiresIn"];
            this.refreshExpiresAt = _data["refreshExpiresAt"] ? new Date(_data["refreshExpiresAt"].toString()) : undefined as any;
            this.refreshExpiresIn = _data["refreshExpiresIn"];
            if (Array.isArray(_data["roleGroupPermissions"])) {
                this.roleGroupPermissions = [] as any;
                for (let item of _data["roleGroupPermissions"])
                    this.roleGroupPermissions!.push(item);
            }
        }
    }

    static fromJS(data: any): LoginResponseDto {
        data = typeof data === 'object' ? data : {};
        let result = new LoginResponseDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["message"] = this.message;
        data["accessToken"] = this.accessToken;
        data["refreshToken"] = this.refreshToken;
        data["user"] = this.user ? this.user.toJSON() : undefined as any;
        data["expiresAt"] = this.expiresAt ? this.expiresAt.toISOString() : undefined as any;
        data["expiresIn"] = this.expiresIn;
        data["refreshExpiresAt"] = this.refreshExpiresAt ? this.refreshExpiresAt.toISOString() : undefined as any;
        data["refreshExpiresIn"] = this.refreshExpiresIn;
        if (Array.isArray(this.roleGroupPermissions)) {
            data["roleGroupPermissions"] = [];
            for (let item of this.roleGroupPermissions)
                data["roleGroupPermissions"].push(item);
        }
        return data;
    }
}

export interface ILoginResponseDto {
    message?: string | undefined;
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
    user?: UserDto;
    expiresAt?: Date;
    expiresIn?: number;
    refreshExpiresAt?: Date | undefined;
    refreshExpiresIn?: number | undefined;
    roleGroupPermissions?: string[] | undefined;
}


