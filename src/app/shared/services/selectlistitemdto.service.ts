/* Auto-generated from service-proxies.ts */

export class SelectListItemDto implements ISelectListItemDto {
    value?: string | undefined;
    text?: string | undefined;

    constructor(data?: ISelectListItemDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (this as any)[property] = (data as any)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.value = _data["value"];
            this.text = _data["text"];
        }
    }

    static fromJS(data: any): SelectListItemDto {
        data = typeof data === 'object' ? data : {};
        let result = new SelectListItemDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["value"] = this.value;
        data["text"] = this.text;
        return data;
    }
}

export interface ISelectListItemDto {
    value?: string | undefined;
    text?: string | undefined;
}


