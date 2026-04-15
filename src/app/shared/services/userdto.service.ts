/* Auto-generated from service-proxies.ts */

export class UserDto implements IUserDto {
    id?: number;
    name?: string | undefined;
    email?: string | undefined;
    provinceCode?: string | undefined;
    districtCode?: string | undefined;
    wardCode?: string | undefined;
    address?: string | undefined;
    idCard?: string | undefined;
    job?: string | undefined;
    dateOfBirth?: Date;
    gender?: string | undefined;
    bikeId?: string | undefined;
    phoneNumber?: string | undefined;
    roleGroupId?: string | undefined;
    password?: string | undefined;
    avatar?: string | undefined;

    constructor(data?: IUserDto) {
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
            this.email = _data["email"];
            this.provinceCode = _data["provinceCode"];
            this.districtCode = _data["districtCode"];
            this.wardCode = _data["wardCode"];
            this.address = _data["address"];
            this.idCard = _data["idCard"];
            this.job = _data["job"];
            this.dateOfBirth = _data["dateOfBirth"] ? new Date(_data["dateOfBirth"].toString()) : undefined as any;
            this.gender = _data["gender"];
            this.bikeId = _data["bikeId"];
            this.phoneNumber = _data["phoneNumber"];
            this.roleGroupId = _data["roleGroupId"];
            this.password = _data["password"];
            this.avatar = _data["avatar"];
        }
    }

    static fromJS(data: any): UserDto {
        data = typeof data === 'object' ? data : {};
        let result = new UserDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["email"] = this.email;
        data["provinceCode"] = this.provinceCode;
        data["districtCode"] = this.districtCode;
        data["wardCode"] = this.wardCode;
        data["address"] = this.address;
        data["idCard"] = this.idCard;
        data["job"] = this.job;
        data["dateOfBirth"] = this.dateOfBirth ? this.dateOfBirth.toISOString() : undefined as any;
        data["gender"] = this.gender;
        data["bikeId"] = this.bikeId;
        data["phoneNumber"] = this.phoneNumber;
        data["roleGroupId"] = this.roleGroupId;
        data["password"] = this.password;
        data["avatar"] = this.avatar;
        return data;
    }
}

export interface IUserDto {
    id?: number;
    name?: string | undefined;
    email?: string | undefined;
    provinceCode?: string | undefined;
    districtCode?: string | undefined;
    wardCode?: string | undefined;
    address?: string | undefined;
    idCard?: string | undefined;
    job?: string | undefined;
    dateOfBirth?: Date;
    gender?: string | undefined;
    bikeId?: string | undefined;
    phoneNumber?: string | undefined;
    roleGroupId?: string | undefined;
    password?: string | undefined;
    avatar?: string | undefined;
}


