import { Component, Inject, OnInit, Optional } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { UserFilterDtoPagedRequestDto, SelectListItem, ServiceProxy, UserDto, UserFilterDto } from '../../shared/services';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { CreateUsersComponent } from './createusers/createusers.component';
import { CategoryCacheService } from '../../shared/category-cache.service';
import { forkJoin, of } from 'rxjs';
import { EditUsersComponent } from './editusers/editusers.component';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { SelectListItemService } from '../../shared/get-select-list-item.service';
import { NzImageModule } from 'ng-zorro-antd/image';
import { API_BASE_URL } from '../../shared/services/service.proxies';
export interface Data {
  id: number;
  name: string;
  email: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  idCard: string;
  job: string;
  dateOfBirth: string;
  gender: string;
  bikeId: string;
  address: string;
  disabled: boolean;
}
@Component({
  selector: 'app-users',
  imports: [NzTableModule, NzButtonModule, CommonModule, NzModalModule, NzIconModule, NzFormModule,
    FormsModule, NzSelectModule, NzInputModule, NzGridModule,
    NzDatePickerModule, NzImageModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
})
export class UsersComponent implements OnInit {
  rolePermissions: string[] = [];
  checked = false;
  loading = false;
  indeterminate = false;
  listOfData: readonly Data[] = [];
  lstUser: readonly UserDto[] = [];
  userFilterDto: UserFilterDto = new UserFilterDto();
  userRequestDto: UserFilterDtoPagedRequestDto = new UserFilterDtoPagedRequestDto();
  setOfCheckedId = new Set<number>();
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  lstProvinces: SelectListItem[] = [];
  lstDistricts: SelectListItem[] = [];
  lstWards: SelectListItem[] = [];
  lstRoleGroups: SelectListItem[] = [];
  baseUrl?: string;
  filterPerRows: Array<Array<{
    label: string;
    key: keyof UserFilterDto;
    type: string;
    options?: () => SelectListItem[];
    placeholder?: string;
  }>> = [];
  controlRequestArray: Array<{
    label: string;
    key: keyof UserFilterDto;
    type: string;
    options?: () => SelectListItem[];
    placeholder?: string;
  }> = [];
  constructor(private _serviceProxy: ServiceProxy, private _getSelectListItem: SelectListItemService,
    private modalService: NzModalService, private memoryCache: CategoryCacheService,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    this.baseUrl = baseUrl;
  }
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  onPageChange(page: number): void {
    debugger
    this.pageIndex = page;
    this.userRequestDto.page = page;
    this.getUsers();
  }
  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.userRequestDto.pageSize = pageSize;
    this.getUsers();
  }
  refreshCheckedStatus(): void {
    const listOfEnabledData = this.lstUser;
    this.checked = listOfEnabledData.every(({ id }) => id !== undefined && this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => id !== undefined && this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.lstUser
      .forEach(({ id }) => id !== undefined && this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  ngOnInit(): void {
    this.userFilterDto.addressFilter = "";
    this.userFilterDto.nameFilter = "";
    this.userFilterDto.emailFilter = "";
    this.userFilterDto.idCardFilter = "";
    this.userFilterDto.provinceCodeFilter = "";
    this.userFilterDto.districtCodeFilter = "";
    this.userFilterDto.wardCodeFilter = "";
    this.userRequestDto.filter = this.userFilterDto;
    this.userRequestDto.page = this.pageIndex;
    this.userRequestDto.pageSize = this.pageSize;
    this.userRequestDto.sortBy = "";
    this.userRequestDto.sortOrder = "";
    const perms = localStorage.getItem('role_group_permissions');
    try {
      this.rolePermissions = perms ? JSON.parse(perms) : [];
    }
    catch {
      this.rolePermissions = [];
    }
    const cachedProvinces = this.memoryCache.get<SelectListItem[]>('provinces');
    const cachedDistricts = this.memoryCache.get<SelectListItem[]>('districts');
    const cachedWards = this.memoryCache.get<SelectListItem[]>('wards');
    const cachedRoleGroups = this.memoryCache.get<SelectListItem[]>('roleGroups');
    const provinceObservable = cachedProvinces ? of(cachedProvinces) : this._getSelectListItem.getSelectListItems('provinces', '');
    const districtObservable = cachedDistricts ? of(cachedDistricts) : this._getSelectListItem.getSelectListItems('districts', '');
    const wardObservable = cachedWards ? of(cachedWards) : this._getSelectListItem.getSelectListItems('wards', '');
    const roleGroupObservable = cachedRoleGroups ? of(cachedRoleGroups) : this._getSelectListItem.getSelectListItems('roleGroups', '');
    this.controlRequestArray = [
      { label: 'Tên', key: 'nameFilter', type: 'text', placeholder: 'Tên người dùng' },
      { label: 'Tỉnh/thành', key: 'provinceCodeFilter', type: 'select', options: () => this.lstProvinces, placeholder: 'Chọn tỉnh/thành' },
      { label: 'Quận/huyện', key: 'districtCodeFilter', type: 'select', options: () => this.lstDistricts, placeholder: 'Chọn quận/huyện' },
      { label: 'Xã/phường', key: 'wardCodeFilter', type: 'select', options: () => this.lstWards, placeholder: 'Chọn xã/phường' },
      { label: 'Địa chỉ đầy đủ', key: 'addressFilter', type: 'text', placeholder: 'Chọn địa chỉ đầy đủ' },
      { label: 'Email', key: 'emailFilter', type: 'text', placeholder: 'Email người dùng' },
      { label: 'CCCD/CMND', key: 'idCardFilter', type: 'text', placeholder: 'CCCD/CMND' },
      { label: 'Ngày sinh', key: 'dateOfBirth', type: 'datetime', placeholder: 'Ngày sinh' },
    ];
    this.filterPerRows = this.chunkArray(this.controlRequestArray, 4);
    forkJoin([provinceObservable, districtObservable, wardObservable, roleGroupObservable])
      .subscribe(([provinces, districts, wards, roleGroups]) => {
        this.lstProvinces = provinces ? provinces : [];
        this.lstDistricts = districts ? districts : [];
        this.lstWards = wards ? wards : [];
        this.lstRoleGroups = roleGroups ? roleGroups : [];
        if (!cachedProvinces) this.memoryCache.set('provinces', provinces);
        if (!cachedDistricts) this.memoryCache.set('districts', districts);
        if (!cachedWards) this.memoryCache.set('wards', wards);
        if (!cachedRoleGroups) this.memoryCache.set('roleGroups', roleGroups);
        this.getUsers();
      },
        error => {
          console.error('Error fetching data:', error);
        }
      );
  }

  getUsers(): void {
    this.userRequestDto.filter = this.userFilterDto;
    this._serviceProxy.getAllUser(this.userRequestDto).subscribe(response => {
      this.lstUser = response.listItem ? response.listItem : [];
      this.total = response.totalCount ? response.totalCount : 0;
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  getProvinceName(provinceId: string | undefined): string {
    if (!provinceId) return '';
    const province = this.lstProvinces.find(p => p.value === provinceId.toString());
    return province ? province.text ?? '' : '';
  }

  getDistrictName(districtId: string | undefined): string {
    if (!districtId) return '';
    const district = this.lstDistricts.find(d => d.value === districtId.toString());
    return district ? district.text ?? '' : '';
  }

  getWardName(wardId: string | undefined): string {
    if (!wardId) return '';
    const ward = this.lstWards.find(w => w.value === wardId.toString());
    return ward ? ward.text ?? '' : '';
  }

  getRoleName(roleGroupId: string | undefined): string {
    if (roleGroupId === undefined || roleGroupId === null) return '';
    const roleGroup = this.lstRoleGroups.find(rg => rg.value === roleGroupId.toString());
    return roleGroup ? roleGroup.text ?? '' : '';
  }
  trackData(index: number, item: any): any {
    return item.id;  // Hoặc bất kỳ thuộc tính duy nhất nào của item
  }

  openCreateUserModal(): void {
    this.modalService.create({
      nzTitle: 'Tạo người dùng mới',
      nzContent: CreateUsersComponent,
      nzWidth: '600px',
      nzStyle: { height: '70vh' },
      nzBodyStyle: { overflow: 'auto', maxHeight: 'calc(70vh - 55px)' },
      nzFooter: [
        {
          label: 'Hủy',
          onClick: () => this.modalService.closeAll(),
        },
        {
          label: 'Lưu',
          type: 'primary',
          disabled: (componentInstance) => !componentInstance?.createUserForm.valid, // Custom disabled
          onClick: (componentInstance) => {
            if (componentInstance) {
              componentInstance.onSubmit(); // Gọi hàm submit trong component con
            }
          },
        },
      ]
    });
  }

  openEditUserModal(user: UserDto): void {
    this.modalService.create<EditUsersComponent, { userData: any }, string>({
      nzTitle: 'Chỉnh sửa người dùng',
      nzContent: EditUsersComponent,
      nzData: { userData: user },
      nzWidth: '600px',
      nzStyle: { height: '70vh' },
      nzBodyStyle: { overflow: 'auto', maxHeight: 'calc(70vh - 55px)' },
      nzFooter: [
        {
          label: 'Hủy',
          onClick: () => this.modalService.closeAll(),
        },
        {
          label: 'Lưu',
          type: 'primary',
          disabled: (componentInstance) => !componentInstance?.editUserForm.valid, // Custom disabled
          onClick: (componentInstance) => {
            if (componentInstance) {
              componentInstance.onSubmit(); // Gọi hàm submit trong component con
            }
          },
        },
      ],
    })
  }
  openDeleteUserModal(user: UserDto): void {
    this._serviceProxy.deleteUser(user.id).subscribe((res: any) => {
      if (res) {
        alert('Đã xoá người dùng thành công!');
        this.getUsers();
      }
      else {
        alert('Xoá người dùng thất bại!');
      }
    });
  }

  chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

  hasPermission(permission: string): boolean {
    return this.rolePermissions.includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => this.rolePermissions.includes(p));
  }
}
