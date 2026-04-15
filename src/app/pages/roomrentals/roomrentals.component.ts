import { Component, Inject, OnInit, Optional } from '@angular/core';
import {
  RoomRentalDto,
  RoomRentalFilterDto,
  SelectListItem,
  RoomRentalFilterDtoPagedRequestDto,
  RoomType,
  RoomStatus,
  ServiceProxy,
  API_BASE_URL
} from '../../shared/services';

import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CategoryCacheService } from '../../shared/category-cache.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

import { CreateRoomRentalsComponent } from './createroomrentals/createroomrentals.component';
import { EditRoomRentalsComponent } from './editroomrentals/editroomrentals.component';
import { SelectListItemService } from '../../shared/get-select-list-item.service';

import { forkJoin, of, take } from 'rxjs';

@Component({
  selector: 'app-roomrentals',
  standalone: true,
  imports: [
    NzIconModule,
    NzFormModule,
    FormsModule,
    NzSelectModule,
    NzInputModule,
    NzGridModule,
    NzDatePickerModule,
    NzTableModule,
    NzButtonModule,
    CommonModule,
    NzModalModule,
    NzSliderModule,
    NzImageModule,
    NzPaginationModule
  ],
  templateUrl: './roomrentals.component.html',
  styleUrls: ['./roomrentals.component.css']
})
export class RoomrentalsComponent implements OnInit {
  rolePermissions: string[] = [];
  loading = false;

  roomRentals: readonly RoomRentalDto[] = [];

  roomRentalFilterDto: RoomRentalFilterDto = new RoomRentalFilterDto();
  roomRentalRequestDto: RoomRentalFilterDtoPagedRequestDto = new RoomRentalFilterDtoPagedRequestDto();

  total = 0;
  pageIndex = 1;
  pageSize = 10;

  lstUser: SelectListItem[] = [];
  lstRoomTypes: SelectListItem[] = [];
  lstRoomStatuses: SelectListItem[] = [];

  priceRange: [number, number] = [0, 100];
  areaRange: [number, number] = [0, 100];

  baseUrl?: string;

  filterPerRows: any[] = [];
  controlRequestArray: any[] = [];

  constructor(
    private serviceProxy: ServiceProxy,
    private getSelectListItem: SelectListItemService,
    private modalService: NzModalService,
    private memoryCache: CategoryCacheService,
    private notification: NzNotificationService,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.loadPermissions();
    this.initFilter();
    this.initControls();
    this.loadDropdownData();
    this.getAllRoomRentals();
  }

  loadPermissions(): void {
    const perms = localStorage.getItem('role_group_permissions');
    this.rolePermissions = perms ? JSON.parse(perms) : [];
  }

  initFilter(): void {
    this.roomRentalFilterDto = new RoomRentalFilterDto();
    this.roomRentalFilterDto.roomNumber = '';
    this.roomRentalFilterDto.roomType = undefined;
    this.roomRentalFilterDto.statusRoom = undefined;
    this.roomRentalFilterDto.note = '';
    this.roomRentalFilterDto.creatorUser = 'all';
    this.roomRentalFilterDto.lastUpdateUser = 'all';
    this.roomRentalFilterDto.createdDate = undefined;
    this.roomRentalFilterDto.updatedDate = undefined;
    this.roomRentalFilterDto.priceStart = '0';
    this.roomRentalFilterDto.priceEnd = '100';
    this.roomRentalFilterDto.areaStart = '0';
    this.roomRentalFilterDto.areaEnd = '100';

    this.roomRentalRequestDto = new RoomRentalFilterDtoPagedRequestDto();
    this.roomRentalRequestDto.page = this.pageIndex;
    this.roomRentalRequestDto.pageSize = this.pageSize;
    this.roomRentalRequestDto.sortBy = 'id';
    this.roomRentalRequestDto.sortOrder = 'desc';
    this.roomRentalRequestDto.filter = this.roomRentalFilterDto;
  }

  initControls(): void {
    this.controlRequestArray = [
      { label: 'Số phòng', key: 'roomNumber', type: 'text' },
      { label: 'Loại phòng', key: 'roomType', type: 'select', options: () => this.lstRoomTypes },
      { label: 'Trạng thái', key: 'statusRoom', type: 'select', options: () => this.lstRoomStatuses },
      { label: 'Ghi chú', key: 'note', type: 'text' },
      { label: 'Người tạo', key: 'creatorUser', type: 'select', options: () => this.lstUser },
      { label: 'Ngày tạo', key: 'createdDate', type: 'datetime' },
      { label: 'Người cập nhật', key: 'lastUpdateUser', type: 'select', options: () => this.lstUser },
      { label: 'Ngày cập nhật', key: 'updatedDate', type: 'datetime' },
      { label: 'Diện tích', key: 'areaStart', type: 'slider' },
      { label: 'Giá tiền', key: 'priceStart', type: 'slider' }
    ];

    this.filterPerRows = this.chunkArray(this.controlRequestArray, 4);
  }

  loadDropdownData(): void {
    const cachedUsers = this.memoryCache.get<SelectListItem[]>('user');
    const cachedRoomTypes = this.memoryCache.get<SelectListItem[]>('roomType');
    const cachedRoomStatuses = this.memoryCache.get<SelectListItem[]>('roomStatus');

    const users$ = cachedUsers
      ? of(cachedUsers)
      : this.getSelectListItem.getSelectListItems('user', '');

    const roomTypes$ = cachedRoomTypes
      ? of(cachedRoomTypes)
      : this.getSelectListItem.getEnumSelectListItems('roomType');

    const roomStatuses$ = cachedRoomStatuses
      ? of(cachedRoomStatuses)
      : this.getSelectListItem.getEnumSelectListItems('roomStatus');

    forkJoin([users$, roomTypes$, roomStatuses$]).subscribe({
      next: ([users, types, statuses]) => {
        this.lstUser = users || [];
        this.lstRoomTypes = types || [];
        this.lstRoomStatuses = statuses || [];

        if (!cachedUsers) {
          this.memoryCache.set('user', this.lstUser);
        }
        if (!cachedRoomTypes) {
          this.memoryCache.set('roomType', this.lstRoomTypes);
        }
        if (!cachedRoomStatuses) {
          this.memoryCache.set('roomStatus', this.lstRoomStatuses);
        }
      },
      error: (error) => {
        console.error('Error loading dropdown data:', error);
      }
    });
  }

  getAllRoomRentals(): void {
    this.loading = true;

    const filter = new RoomRentalFilterDto();
    Object.assign(filter, this.roomRentalFilterDto);

    filter.roomNumber = filter.roomNumber?.trim() || '';
    filter.note = filter.note?.trim() || '';
    filter.creatorUser = filter.creatorUser || 'all';
    filter.lastUpdateUser = filter.lastUpdateUser || 'all';

    filter.priceStart = this.priceRange[0].toString();
    filter.priceEnd = this.priceRange[1].toString();
    filter.areaStart = this.areaRange[0].toString();
    filter.areaEnd = this.areaRange[1].toString();

    this.roomRentalRequestDto.filter = filter;
    this.roomRentalRequestDto.page = this.pageIndex;
    this.roomRentalRequestDto.pageSize = this.pageSize;
    this.roomRentalRequestDto.sortBy = this.roomRentalRequestDto.sortBy || 'id';
    this.roomRentalRequestDto.sortOrder = this.roomRentalRequestDto.sortOrder || 'desc';

    console.log('roomRentalRequestDto:', this.roomRentalRequestDto);

    this.serviceProxy.getAllRoomRental(this.roomRentalRequestDto).subscribe({
      next: (res) => {
        this.roomRentals = res.listItem || [];
        this.total = res.totalCount || 0;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error getAllRoomRental:', error);
        console.error('Error response:', error?.response);
      }
    });
  }

  onSearch(): void {
    this.pageIndex = 1;
    this.getAllRoomRentals();
  }

  onResetFilter(): void {
    this.pageIndex = 1;
    this.priceRange = [0, 100];
    this.areaRange = [0, 100];
    this.initFilter();
    this.getAllRoomRentals();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.getAllRoomRentals();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
    this.getAllRoomRentals();
  }

  chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  getSliderValue(key: string): [number, number] {
    return key === 'priceStart' ? this.priceRange : this.areaRange;
  }

  setSliderValue(key: string, range: [number, number]): void {
    if (key === 'priceStart') {
      this.priceRange = range;
    } else {
      this.areaRange = range;
    }
  }

  trackData(index: number, item: any): any {
    return item?.id ?? index;
  }

  getRoomTypeText(value: RoomType): string {
    return this.lstRoomTypes.find(x => String(x.value) === String(value))?.text || '';
  }

  getRoomStatusText(value: RoomStatus): string {
    return this.lstRoomStatuses.find(x => String(x.value) === String(value))?.text || '';
  }

  hasPermission(permission: string): boolean {
    return this.rolePermissions.includes(permission);
  }

  openCreateRoomRentalModal(): void {
    const modal = this.modalService.create({
      nzTitle: 'Tạo phòng',
      nzContent: CreateRoomRentalsComponent,
      nzFooter: null
    });

    const comp = modal.getContentComponent();
    if (comp) {
      comp.saved.pipe(take(1)).subscribe(() => {
        this.getAllRoomRentals();
        modal.close();
      });
    }
  }

  openEditRoomRentalModal(data: RoomRentalDto): void {
    this.modalService.create({
      nzTitle: 'Sửa phòng',
      nzFooter: null,
      nzContent: EditRoomRentalsComponent,
      nzData: { roomrentalData: data }
    });
  }

  openDeleteRoomRentalModal(id: number): void {
    this.serviceProxy.roomRentalDELETE(id).subscribe({
      next: () => {
        this.getAllRoomRentals();
        this.notification.success('OK', 'Đã xóa');
      },
      error: (error) => {
        console.error('Error deleting room rental:', error);
        this.notification.error('Lỗi', 'Xóa thất bại');
      }
    });
  }
}
