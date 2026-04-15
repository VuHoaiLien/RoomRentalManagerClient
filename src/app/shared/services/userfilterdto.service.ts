/* Auto-generated from service-proxies.ts */

export class UserFilterDto implements IUserFilterDto {
    nameFilter?: string | undefined;
    emailFilter?: string | undefined;
    provinceCodeFilter?: string | undefined;
    districtCodeFilter?: string | undefined;
    wardCodeFilter?: string | undefined;
    addressFilter?: string | undefined;
    idCardFilter?: string | undefined;
    dateOfBirth?: Date | undefined;

    constructor(data?: IUserFilterDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (this as any)[property] = (data as any)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.nameFilter = _data["nameFilter"];
            this.emailFilter = _data["emailFilter"];
            this.provinceCodeFilter = _data["provinceCodeFilter"];
            this.districtCodeFilter = _data["districtCodeFilter"];
            this.wardCodeFilter = _data["wardCodeFilter"];
            this.addressFilter = _data["addressFilter"];
            this.idCardFilter = _data["idCardFilter"];
            this.dateOfBirth = _data["dateOfBirth"] ? new Date(_data["dateOfBirth"].toString()) : undefined as any;
        }
    }

    static fromJS(data: any): UserFilterDto {
        data = typeof data === 'object' ? data : {};
        let result = new UserFilterDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["nameFilter"] = this.nameFilter;
        data["emailFilter"] = this.emailFilter;
        data["provinceCodeFilter"] = this.provinceCodeFilter;
        data["districtCodeFilter"] = this.districtCodeFilter;
        data["wardCodeFilter"] = this.wardCodeFilter;
        data["addressFilter"] = this.addressFilter;
        data["idCardFilter"] = this.idCardFilter;
        data["dateOfBirth"] = this.dateOfBirth ? this.dateOfBirth.toISOString() : undefined as any;
        return data;
    }
}

export interface IUserFilterDto {
    nameFilter?: string | undefined;
    emailFilter?: string | undefined;
    provinceCodeFilter?: string | undefined;
    districtCodeFilter?: string | undefined;
    wardCodeFilter?: string | undefined;
    addressFilter?: string | undefined;
    idCardFilter?: string | undefined;
    dateOfBirth?: Date | undefined;
}


