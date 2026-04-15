/* Auto-generated from service-proxies.ts */
import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { SelectListItem } from './selectlistitem.service';
import { SelectListItemDto } from './selectlistitemdto.service';
import { LoginResponseDto } from './loginresponsedto.service';
import { RefreshRequestDto } from './refreshrequestdto.service';
import { RoleGroupFilterDtoPagedRequestDto } from './rolegroupfilterdtopagedrequestdto.service';
import { RoleGroupDtoPagedResultDto } from './rolegroupdtopagedresultdto.service';
import { CreateOrEditRoleGroupDto } from './createoreditrolegroupdto.service';
import { RoomRentalFilterDtoPagedRequestDto } from './roomrentalfilterdtopagedrequestdto.service';
import { RoomRentalDtoPagedResultDto } from './roomrentaldtopagedresultdto.service';
import { RoomRentalDto } from './roomrentaldto.service';
import { ProblemDetails } from './problemdetails.service';
import { CreateOrEditRoomRentalDto } from './createoreditroomrentaldto.service';
import { FileParameter, UserFilterDtoPagedRequestDto } from './userfilterdtopagedrequestdto.service';
import { CreateOrEditUserDto } from './createoredituserdto.service';
import { UserDtoPagedResultDto } from './userdtopagedresultdto.service';
import { RoleDto } from './roledto.service';
import { GoogleLoginRequestDto } from './googleloginrequestdto.service';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Injectable({
    providedIn: 'root'
})

export class ServiceProxy {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ?? "https://localhost:7246";
    }

    /**
     * @param type (optional) 
     * @param cascadeValue (optional) 
     * @return Success
     */
    getSelectListItem(type: string | undefined, cascadeValue: string | undefined): Observable<SelectListItem[]> {
        let url_ = this.baseUrl + "/api/Common/getSelectListItem?";
        if (type === null)
            throw new globalThis.Error("The parameter 'type' cannot be null.");
        else if (type !== undefined)
            url_ += "type=" + encodeURIComponent("" + type) + "&";
        if (cascadeValue === null)
            throw new globalThis.Error("The parameter 'cascadeValue' cannot be null.");
        else if (cascadeValue !== undefined)
            url_ += "cascadeValue=" + encodeURIComponent("" + cascadeValue) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetSelectListItem(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetSelectListItem(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<SelectListItem[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<SelectListItem[]>;
        }));
    }

    protected processGetSelectListItem(response: HttpResponseBase): Observable<SelectListItem[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (Array.isArray(resultData200)) {
                result200 = [] as any;
                for (let item of resultData200)
                    result200!.push(SelectListItem.fromJS(item));
            }
            else {
                result200 = null as any;
            }
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<SelectListItem[]>([]);
    }

    /**
     * @param enumType (optional) 
     * @return Success
     */
    getEnumSelectListItem(enumType: string | undefined): Observable<SelectListItemDto[]> {
        let url_ = this.baseUrl + "/api/Common/getEnumSelectListItem?";
        if (enumType === null)
            throw new globalThis.Error("The parameter 'enumType' cannot be null.");
        else if (enumType !== undefined)
            url_ += "enumType=" + encodeURIComponent("" + enumType) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetEnumSelectListItem(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetEnumSelectListItem(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<SelectListItemDto[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<SelectListItemDto[]>;
        }));
    }

    protected processGetEnumSelectListItem(response: HttpResponseBase): Observable<SelectListItemDto[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (Array.isArray(resultData200)) {
                result200 = [] as any;
                for (let item of resultData200)
                    result200!.push(SelectListItemDto.fromJS(item));
            }
            else {
                result200 = null as any;
            }
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<SelectListItemDto[]>([]);
    }

    /**
     * @param username (optional) 
     * @param password (optional) 
     * @param rememberMe (optional) 
     * @return Success
     */
    login(username: string | undefined, password: string | undefined, rememberMe: boolean | undefined): Observable<LoginResponseDto> {
        let url_ = this.baseUrl + "/api/Login?";
        if (username === null)
            throw new globalThis.Error("The parameter 'username' cannot be null.");
        else if (username !== undefined)
            url_ += "username=" + encodeURIComponent("" + username) + "&";
        if (password === null)
            throw new globalThis.Error("The parameter 'password' cannot be null.");
        else if (password !== undefined)
            url_ += "password=" + encodeURIComponent("" + password) + "&";
        if (rememberMe === null)
            throw new globalThis.Error("The parameter 'rememberMe' cannot be null.");
        else if (rememberMe !== undefined)
            url_ += "rememberMe=" + encodeURIComponent("" + rememberMe) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processLogin(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processLogin(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<LoginResponseDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<LoginResponseDto>;
        }));
    }

    protected processLogin(response: HttpResponseBase): Observable<LoginResponseDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = LoginResponseDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<LoginResponseDto>(null as any);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    refresh(body: RefreshRequestDto | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/Login/refresh";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processRefresh(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processRefresh(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processRefresh(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(null as any);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(null as any);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    logout(body: number | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/Login/logout";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processLogout(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processLogout(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processLogout(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(null as any);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(null as any);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    google(body: GoogleLoginRequestDto | undefined): Observable<LoginResponseDto> {
        let url_ = this.baseUrl + "/api/Login/google";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGoogle(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGoogle(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<LoginResponseDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<LoginResponseDto>;
        }));
    }

    protected processGoogle(response: HttpResponseBase): Observable<LoginResponseDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = LoginResponseDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<LoginResponseDto>(null as any);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    getAllRoleGroups(body: RoleGroupFilterDtoPagedRequestDto | undefined): Observable<RoleGroupDtoPagedResultDto> {
        let url_ = this.baseUrl + "/api/RoleGroup/getAllRoleGroupsAsync";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetAllRoleGroups(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllRoleGroups(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<RoleGroupDtoPagedResultDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<RoleGroupDtoPagedResultDto>;
        }));
    }

    protected processGetAllRoleGroups(response: HttpResponseBase): Observable<RoleGroupDtoPagedResultDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = RoleGroupDtoPagedResultDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<RoleGroupDtoPagedResultDto>(null as any);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    createOrEditRoleGroup(body: CreateOrEditRoleGroupDto | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/RoleGroup/createOrEditRoleGroup";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processCreateOrEditRoleGroup(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateOrEditRoleGroup(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processCreateOrEditRoleGroup(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(null as any);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(null as any);
    }

    /**
     * @return Success
     */
    roleGroup(id: number): Observable<void> {
        let url_ = this.baseUrl + "/api/RoleGroup/{id}";
        if (id === undefined || id === null)
            throw new globalThis.Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            })
        };

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processRoleGroup(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processRoleGroup(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processRoleGroup(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(null as any);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(null as any);
    }

    /**
     * @return Success
     */
    getAllRole(): Observable<RoleDto[]> {
        let url_ = this.baseUrl + "/api/RoleGroup/getAllRole";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetAllRole(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllRole(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<RoleDto[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<RoleDto[]>;
        }));
    }

    protected processGetAllRole(response: HttpResponseBase): Observable<RoleDto[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (Array.isArray(resultData200)) {
                result200 = [] as any;
                for (let item of resultData200)
                    result200!.push(RoleDto.fromJS(item));
            }
            else {
                result200 = null as any;
            }
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<RoleDto[]>([]);
    }

    /**
     * @param roleGroupId (optional) 
     * @return Success
     */
    getActivePermission(roleGroupId: number | undefined): Observable<number[]> {
        let url_ = this.baseUrl + "/api/RoleGroup/getActivePermission?";
        if (roleGroupId === null)
            throw new globalThis.Error("The parameter 'roleGroupId' cannot be null.");
        else if (roleGroupId !== undefined)
            url_ += "roleGroupId=" + encodeURIComponent("" + roleGroupId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetActivePermission(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetActivePermission(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<number[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<number[]>;
        }));
    }

    protected processGetActivePermission(response: HttpResponseBase): Observable<number[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (Array.isArray(resultData200)) {
                result200 = [] as any;
                for (let item of resultData200)
                    result200!.push(item);
            }
            else {
                result200 = null as any;
            }
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<number[]>([]);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    getAllRoomRental(body: RoomRentalFilterDtoPagedRequestDto | undefined): Observable<RoomRentalDtoPagedResultDto> {
        let url_ = this.baseUrl + "/api/RoomRental/getAllRoomRentalAsync";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetAllRoomRental(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllRoomRental(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<RoomRentalDtoPagedResultDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<RoomRentalDtoPagedResultDto>;
        }));
    }

    protected processGetAllRoomRental(response: HttpResponseBase): Observable<RoomRentalDtoPagedResultDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = RoomRentalDtoPagedResultDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<RoomRentalDtoPagedResultDto>(null as any);
    }

    /**
     * @return Success
     */
    roomRentalGET(id: number): Observable<RoomRentalDto> {
        let url_ = this.baseUrl + "/api/RoomRental/{id}";
        if (id === undefined || id === null)
            throw new globalThis.Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processRoomRentalGET(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processRoomRentalGET(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<RoomRentalDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<RoomRentalDto>;
        }));
    }

    protected processRoomRentalGET(response: HttpResponseBase): Observable<RoomRentalDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = RoomRentalDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status === 404) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result404: any = null;
            let resultData404 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result404 = ProblemDetails.fromJS(resultData404);
            return throwException("Not Found", status, _responseText, _headers, result404);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<RoomRentalDto>(null as any);
    }

    /**
     * @return Success
     */
    roomRentalDELETE(id: number): Observable<void> {
        let url_ = this.baseUrl + "/api/RoomRental/{id}";
        if (id === undefined || id === null)
            throw new globalThis.Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            })
        };

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processRoomRentalDELETE(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processRoomRentalDELETE(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processRoomRentalDELETE(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(null as any);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(null as any);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    createOrEdit(body: CreateOrEditRoomRentalDto | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/RoomRental/createOrEdit";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processCreateOrEdit(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateOrEdit(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processCreateOrEdit(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(null as any);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(null as any);
    }

    /**
     * @param uploadImages (optional) 
     * @return Success
     */
    uploadImageDescription(uploadImages: FileParameter[] | undefined): Observable<string[]> {
        let url_ = this.baseUrl + "/api/RoomRental/uploadImageDescription";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = new FormData();
        if (uploadImages === null || uploadImages === undefined)
            throw new globalThis.Error("The parameter 'uploadImages' cannot be null.");
        else
            uploadImages.forEach(item_ => content_.append("uploadImages", item_.data, item_.fileName ? item_.fileName : "uploadImages") );

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processUploadImageDescription(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUploadImageDescription(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<string[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<string[]>;
        }));
    }

    protected processUploadImageDescription(response: HttpResponseBase): Observable<string[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let images: string[] = [];
                try{
                    images = _responseText ? JSON.parse(_responseText).paths : [];
                }
                catch(e) {
                    console.error('Error parsing response:', e);
                    images = [];
                }
                return _observableOf(images);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf([] as string[]);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    createOrEditUser(body: CreateOrEditUserDto | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/User/createOrEditUser";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processCreateOrEditUser(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateOrEditUser(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processCreateOrEditUser(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(null as any);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(null as any);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    getAllUser(body: UserFilterDtoPagedRequestDto | undefined): Observable<UserDtoPagedResultDto> {
        let url_ = this.baseUrl + "/api/User/getAllUserAsync";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetAllUser(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllUser(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<UserDtoPagedResultDto>;
                }
            } else
                return _observableThrow(response_) as any as Observable<UserDtoPagedResultDto>;
        }));
    }

    protected processGetAllUser(response: HttpResponseBase): Observable<UserDtoPagedResultDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = UserDtoPagedResultDto.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<UserDtoPagedResultDto>(null as any);
    }

    /**
     * @return Success
     */
    getAllProvince(): Observable<SelectListItem[]> {
        let url_ = this.baseUrl + "/api/User/getAllProvince";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetAllProvince(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllProvince(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<SelectListItem[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<SelectListItem[]>;
        }));
    }

    protected processGetAllProvince(response: HttpResponseBase): Observable<SelectListItem[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (Array.isArray(resultData200)) {
                result200 = [] as any;
                for (let item of resultData200)
                    result200!.push(SelectListItem.fromJS(item));
            }
            else {
                result200 = null as any;
            }
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<SelectListItem[]>([]);
    }

    /**
     * @param provinceCode (optional) 
     * @return Success
     */
    getAllDistrict(provinceCode: string | undefined): Observable<SelectListItem[]> {
        let url_ = this.baseUrl + "/api/User/getAllDistrict?";
        if (provinceCode === null)
            throw new globalThis.Error("The parameter 'provinceCode' cannot be null.");
        else if (provinceCode !== undefined)
            url_ += "provinceCode=" + encodeURIComponent("" + provinceCode) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetAllDistrict(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllDistrict(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<SelectListItem[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<SelectListItem[]>;
        }));
    }

    protected processGetAllDistrict(response: HttpResponseBase): Observable<SelectListItem[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (Array.isArray(resultData200)) {
                result200 = [] as any;
                for (let item of resultData200)
                    result200!.push(SelectListItem.fromJS(item));
            }
            else {
                result200 = null as any;
            }
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<SelectListItem[]>([]);
    }

    /**
     * @param districtCode (optional) 
     * @return Success
     */
    getAllWard(districtCode: string | undefined): Observable<SelectListItem[]> {
        let url_ = this.baseUrl + "/api/User/getAllWard?";
        if (districtCode === null)
            throw new globalThis.Error("The parameter 'districtCode' cannot be null.");
        else if (districtCode !== undefined)
            url_ += "districtCode=" + encodeURIComponent("" + districtCode) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetAllWard(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllWard(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<SelectListItem[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<SelectListItem[]>;
        }));
    }

    protected processGetAllWard(response: HttpResponseBase): Observable<SelectListItem[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (Array.isArray(resultData200)) {
                result200 = [] as any;
                for (let item of resultData200)
                    result200!.push(SelectListItem.fromJS(item));
            }
            else {
                result200 = null as any;
            }
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<SelectListItem[]>([]);
    }

    /**
     * @param id (optional) 
     * @return Success
     */
    deleteUser(id: number | undefined): Observable<void> {
        let url_ = this.baseUrl + "/api/User/deleteUser?";
        if (id === null)
            throw new globalThis.Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "id=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            })
        };

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processDeleteUser(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeleteUser(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else
                return _observableThrow(response_) as any as Observable<void>;
        }));
    }

    protected processDeleteUser(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return _observableOf<void>(null as any);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(null as any);
    }

    /**
     * @param avatar (optional) 
     * @return Success
     */
    uploadAvatar(avatar: FileParameter[] | undefined): Observable<string[]> {
        let url_ = this.baseUrl + "/api/User/uploadAvatar";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = new FormData();
        if (avatar === null || avatar === undefined)
            throw new globalThis.Error("The parameter 'avatar' cannot be null.");
        else
            avatar.forEach(item_ => content_.append("avatar", item_.data, item_.fileName ? item_.fileName : "avatar") );

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processUploadAvatar(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUploadAvatar(response_ as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<string[]>;
                }
            } else
                return _observableThrow(response_) as any as Observable<string[]>;
        }));
    }

    protected processUploadAvatar(response: HttpResponseBase): Observable<string[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (response as any).error instanceof Blob ? (response as any).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let images: string[] = [];
                try{
                    images = _responseText ? JSON.parse(_responseText).paths : [];
                }
                catch(e) {
                    console.error('Error parsing response:', e);
                    images = [];
                }
                return _observableOf(images);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf([] as string[]);
    }
}

export class ApiException extends Error {
    override message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isApiException = true;

    static isApiException(obj: any): obj is ApiException {
        return obj.isApiException === true;
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): Observable<any> {
    if (result !== null && result !== undefined)
        return _observableThrow(result);
    else
        return _observableThrow(new ApiException(message, status, response, headers, null));
}

function blobToText(blob: any): Observable<string> {
    return new Observable<string>((observer: any) => {
        if (!blob) {
            observer.next("");
            observer.complete();
        } else {
            let reader = new FileReader();
            reader.onload = event => {
                observer.next((event.target as any).result);
                observer.complete();
            };
            reader.readAsText(blob);
        }
    });
}


