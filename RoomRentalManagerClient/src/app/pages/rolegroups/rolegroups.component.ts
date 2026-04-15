import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { forkJoin, of, take } from 'rxjs';
import { CategoryCacheService } from '../../shared/category-cache.service';
import { SelectListItemService } from '../../shared/get-select-list-item.service';
import { RoleGroupDto, RoleGroupFilterDto, RoleGroupFilterDtoPagedRequestDto, SelectListItem, ServiceProxy } from '../../shared/services';
import { CreateRoleGroupsComponent } from './createrolegroups/createrolegroups.component';
import { EditRoleGroupsComponent } from './editrolegroups/editrolegroups.component';

@Component({
  selector: 'app-rolegroups',
  imports: [NzIconModule, NzFormModule, FormsModule, NzSelectModule, NzInputModule, NzGridModule,
    NzDatePickerModule, NzTableModule, NzButtonModule, CommonModule, NzModalModule, NzSliderModule, NzImageModule],
  templateUrl: './rolegroups.component.html',
  styleUrls: ['./rolegroups.component.css'],
  standalone: true,
})
export class RoleGroupsComponent {
  rolePermissions: string[] = [];
  checked = false;
  loading = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  lstUser: SelectListItem[] = [];
  roleGroups: readonly RoleGroupDto[] = [];
  roleGroupsFilterDto: RoleGroupFilterDto = new RoleGroupFilterDto();
  roleGroupRequestDto: RoleGroupFilterDtoPagedRequestDto = new RoleGroupFilterDtoPagedRequestDto();
  filterPerRows: Array<Array<{
    label: string;
    key: keyof RoleGroupFilterDto;
    type: string;
    options?: () => SelectListItem[];
    placeholder?: string;
  }>> = [];
  controlRequestArray: Array<{
    label: string;
    key: keyof RoleGroupFilterDto;
    type: string;
    options?: () => SelectListItem[];
    placeholder?: string;
  }> = [];
  constructor(private _serviceProxy: ServiceProxy, private _getSelectListItem: SelectListItemService, private modalService: NzModalService, private memoryCache: CategoryCacheService, private notification: NzNotificationService) { }
  onPageChange(page: number): void {
    this.pageIndex = page;
    this.roleGroupRequestDto.page = page;
    this.getAllRoleGroups();
  }
  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.roleGroupRequestDto.pageSize = pageSize;
    this.getAllRoleGroups();
  }
  refreshCheckedStatus(): void {
    const listOfEnabledData = this.roleGroups;
    this.checked = listOfEnabledData.every(({ id }) => id !== undefined && this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => id !== undefined && this.setOfCheckedId.has(id)) && !this.checked;
  }
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  onAllChecked(checked: boolean): void {
    this.roleGroups
      .forEach(({ id }) => id !== undefined && this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
  trackData(index: number, item: any): any {
    return item.id;  // Hoặc bất kỳ thuộc tính duy nhất nào của item
  }
  ngOnInit(): void {
    const cachedUsers = this.memoryCache.get<SelectListItem[]>('user');
    const userObservable = cachedUsers ? of(cachedUsers) : this._getSelectListItem.getSelectListItems("user", "");
    this.roleGroupsFilterDto.name = "";
    this.roleGroupsFilterDto.descriptions = "";
    this.roleGroupsFilterDto.active = undefined;
    this.roleGroupsFilterDto.creatorUser = "";
    this.roleGroupsFilterDto.lastUpdateUser = "";
    this.roleGroupsFilterDto.createdAt = undefined;
    this.roleGroupsFilterDto.updatedAt = undefined;
    this.roleGroupRequestDto.filter = this.roleGroupsFilterDto;
    this.roleGroupRequestDto.page = this.pageIndex;
    this.roleGroupRequestDto.pageSize = this.pageSize;
    this.roleGroupRequestDto.sortBy = "";
    this.roleGroupRequestDto.sortOrder = "";
    const perms = localStorage.getItem('role_group_permissions');
    try{
      this.rolePermissions = perms ? JSON.parse(perms) : [];
    }
    catch{
      this.rolePermissions = [];
    }
    this.controlRequestArray = [
      { label: 'Tên nhóm quyền', key: 'name', type: 'text', placeholder: 'Nhập tên nhóm quyền' },
      { label: 'Trạng thái nhóm quyền', key: 'active', type: 'text', placeholder: 'Nhập trạng thái nhóm quyền' },
      { label: 'Người tạo', key: 'creatorUser', type: 'select', options: () => this.lstUser, placeholder: 'Người tạo' },
      { label: 'Ngày tạo', key: 'createdAt', type: 'datetime', placeholder: '' },
      { label: 'Người cập nhật', key: 'lastUpdateUser', type: 'select', options: () => this.lstUser, placeholder: 'Người cập nhật' },
      { label: 'Ngày cập nhật', key: 'updatedAt', type: 'datetime', placeholder: '' }
    ];
    this.filterPerRows = this.chunkArray(this.controlRequestArray, 4);
    forkJoin([userObservable])
      .subscribe(([users]) => {
        this.lstUser = users ? users : [];
        if (!cachedUsers) this.memoryCache.set('user', users);
      },
        error => {
          console.error('Error fetching data:', error);
        }
      );
    this.getAllRoleGroups();
  }
  getAllRoleGroups(): void {
    const filterToSend = new RoleGroupFilterDto();
    Object.assign(filterToSend, this.roleGroupsFilterDto);
    if (filterToSend.name !== undefined) {
      filterToSend.name = String(filterToSend.name);
    }
    if (filterToSend.active !== undefined) {
      filterToSend.active = Number(filterToSend.active) as any;
    }

    this.roleGroupRequestDto.filter = filterToSend;
    this._serviceProxy.getAllRoleGroups(this.roleGroupRequestDto).subscribe(response => {
      this.roleGroups = response.listItem ? response.listItem : [];
      this.total = response.totalCount ? response.totalCount : 0;
    }, error => {
      console.error('Error fetching role groups:', error);
    });
  }
 
  chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }
  getEnumOptions<T>(enumObj: T): SelectListItem[] {
    return Object.keys(enumObj as object)
      .map(key => {
        const item = new SelectListItem();
        item.value = (enumObj as any)[key];
        item.text = key;
        return item;
      });
  }
  openCreateRoleGroupModal(): void {
    const modal =this.modalService.create({
      nzTitle: 'Tạo nhóm quyền mới',
      nzContent: CreateRoleGroupsComponent,
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
          disabled: (componentInstance) => !componentInstance?.createRoleGroupForm.valid,
          onClick: (componentInstance) => {
            if (componentInstance) {
              componentInstance.onSubmit(); // Gọi hàm submit trong component con
            }
          },
        },
      ]
    });

    const contentComp = modal.getContentComponent() as CreateRoleGroupsComponent | null;
    if (contentComp) {
      const sub = contentComp.saved.pipe(take(1)).subscribe(() => {
        this.getAllRoleGroups();
        this.notification.success('Thành công', 'Nhóm quyền đã được tạo.');
        modal.close();
        sub.unsubscribe();
      });
    }
  }

  openEditRoleGroupModal(roleGroup: RoleGroupDto): void {
    this.modalService.create<EditRoleGroupsComponent, { roleGroupData: RoleGroupDto }, string>({
      nzTitle: 'Chỉnh sửa nhóm quyền',
      nzContent: EditRoleGroupsComponent,
      nzData: { roleGroupData: roleGroup },
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
          disabled: (componentInstance) => !componentInstance?.editRoleGroupForm.valid,
          onClick: (componentInstance) => {
            if (componentInstance) {
              componentInstance.onSubmit(); // Gọi hàm submit trong component con
            }
          },
        },
      ],
    })
  }
  openDeleteRoleGroupModal(id: number): void {
    this.modalService.confirm({
      nzTitle: 'Xóa nhóm quyền',
      nzContent: '<p>Bạn có chắc chắn muốn xóa nhóm quyền này?</p><p style="color: red; font-weight: bold;">Lưu ý: Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan đến nhóm quyền này.</p>',
      nzOkText: 'Xóa',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this._serviceProxy.roleGroup(id).subscribe({
          next: () => {
            this.getAllRoleGroups();
            this.notification.success('Xóa thành công', 'Nhóm quyền đã được xóa thành công.');
          },
          error: (err) => {
            console.error('Error deleting role group:', err);
            this.notification.error('Lỗi', 'Không thể xóa nhóm quyền. Vui lòng thử lại.');
          },
        });
      },
      nzCancelText: 'Hủy',
    });
  }
  hasPermission(permission: string): boolean {
    return this.rolePermissions.includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => this.rolePermissions.includes(p));
  }
}

