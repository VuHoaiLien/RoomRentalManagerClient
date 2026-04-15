/* Auto-generated from service-proxies.ts */

import { SelectListGroup } from "./selectlistgroup.service";

export class SelectListItem implements ISelectListItem {
    disabled?: boolean;
    group?: SelectListGroup;
    selected?: boolean;
    text?: string | undefined;
    value?: string | undefined;

    constructor(data?: ISelectListItem) {
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
            this.group = _data["group"] ? SelectListGroup.fromJS(_data["group"]) : undefined as any;
            this.selected = _data["selected"];
            this.text = _data["text"];
            this.value = _data["value"];
        }
    }

    static fromJS(data: any): SelectListItem {
        data = typeof data === 'object' ? data : {};
        let result = new SelectListItem();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["disabled"] = this.disabled;
        data["group"] = this.group ? this.group.toJSON() : undefined as any;
        data["selected"] = this.selected;
        data["text"] = this.text;
        data["value"] = this.value;
        return data;
    }
}

export interface ISelectListItem {
    disabled?: boolean;
    group?: SelectListGroup;
    selected?: boolean;
    text?: string | undefined;
    value?: string | undefined;
}


