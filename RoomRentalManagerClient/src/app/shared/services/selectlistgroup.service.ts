/* Auto-generated from service-proxies.ts */

export class SelectListGroup implements ISelectListGroup {
    disabled?: boolean;
    name?: string | undefined;

    constructor(data?: ISelectListGroup) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (this as any)[property] = (data as any)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.disabled = _data["disabled"];
            this.name = _data["name"];
        }
    }

    static fromJS(data: any): SelectListGroup {
        data = typeof data === 'object' ? data : {};
        let result = new SelectListGroup();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["disabled"] = this.disabled;
        data["name"] = this.name;
        return data;
    }
}

export interface ISelectListGroup {
    disabled?: boolean;
    name?: string | undefined;
}


