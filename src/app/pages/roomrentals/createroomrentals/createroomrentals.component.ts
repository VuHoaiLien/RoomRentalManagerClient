import { CreateOrEditRoomRentalDto, SelectListItem, ServiceProxy } from '../../../shared/services';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { CategoryCacheService } from '../../../shared/category-cache.service';
import { SelectListItemService } from '../../../shared/get-select-list-item.service';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

@Component({
  selector: 'app-createroomrentals',
  imports: [
    ReactiveFormsModule,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    NzDatePickerModule,
    NzSelectModule,
    CommonModule,
    NzUploadModule,
    NzIconModule
  ],
  templateUrl: './createroomrentals.component.html',
  styleUrls: ['./createroomrentals.component.css']
})
export class CreateRoomRentalsComponent implements OnInit {
  createRoomRentalForm!: FormGroup;
  lstUser: SelectListItem[] = [];
  lstRoomTypes: SelectListItem[] = [];
  lstRoomStatuses: SelectListItem[] = [];

  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  @Output() saved = new EventEmitter<void>();

  controlRequestArray: Array<{
    label: string;
    key: string;
    type: string;
    options?: () => SelectListItem[];
    placeholder?: string;
    validators?: any[];
  }> = [];

  constructor(
    private fb: FormBuilder,
    private serviceProxy: ServiceProxy,
    private memoryCache: CategoryCacheService,
    private getSelectListItemService: SelectListItemService
  ) {
    this.initializeFormControls();
  }

  ngOnInit(): void {
    const cachedRoomTypes = this.memoryCache.get<SelectListItem[]>('roomType');
    const cachedRoomStatus = this.memoryCache.get<SelectListItem[]>('roomStatus');
    const cachedUsers = this.memoryCache.get<SelectListItem[]>('user');

    const userObservable$ = cachedUsers
      ? of(cachedUsers)
      : this.getSelectListItemService.getSelectListItems('user', '');

    const roomTypeObservable$ = cachedRoomTypes
      ? of(cachedRoomTypes)
      : this.getSelectListItemService.getEnumSelectListItems('roomType');

    const roomStatusObservable$ = cachedRoomStatus
      ? of(cachedRoomStatus)
      : this.getSelectListItemService.getEnumSelectListItems('roomStatus');

    forkJoin([userObservable$, roomTypeObservable$, roomStatusObservable$]).subscribe({
      next: ([users, roomTypes, roomStatus]) => {
        this.lstUser = users || [];
        this.lstRoomTypes = roomTypes || [];
        this.lstRoomStatuses = roomStatus || [];

        if (!cachedUsers) {
          this.memoryCache.set('user', users);
        }
        if (!cachedRoomTypes) {
          this.memoryCache.set('roomType', roomTypes);
        }
        if (!cachedRoomStatus) {
          this.memoryCache.set('roomStatus', roomStatus);
        }

        this.initializeFormControls();
      },
      error: error => {
        console.error('Error fetching data:', error);
      }
    });
  }

  initializeFormControls(): void {
    this.controlRequestArray = [
      {
        label: 'Số phòng',
        key: 'roomNumber',
        type: 'text',
        placeholder: 'Nhập số phòng',
        validators: [Validators.required]
      },
      {
        label: 'Loại phòng',
        key: 'roomType',
        type: 'select',
        options: () => this.lstRoomTypes,
        placeholder: 'Chọn loại phòng',
        validators: [Validators.required]
      },
      {
        label: 'Trạng thái phòng',
        key: 'statusRoom',
        type: 'select',
        options: () => this.lstRoomStatuses,
        placeholder: 'Chọn trạng thái phòng',
        validators: [Validators.required]
      },
      {
        label: 'Ghi chú',
        key: 'note',
        type: 'text',
        placeholder: 'Nhập ghi chú',
        validators: []
      },
      {
        label: 'Diện tích',
        key: 'area',
        type: 'number',
        placeholder: 'Nhập diện tích (m²)',
        validators: [Validators.required]
      },
      {
        label: 'Giá',
        key: 'price',
        type: 'number',
        placeholder: 'Nhập giá phòng',
        validators: [Validators.required]
      },
      {
        label: 'Ảnh mô tả',
        key: 'imagesDescription',
        type: 'file',
        placeholder: 'Chọn ảnh mô tả',
        validators: []
      }
    ];

    const formControls: { [key: string]: any } = {};
    this.controlRequestArray.forEach(control => {
      formControls[control.key] = ['', control.validators || []];
    });

    this.createRoomRentalForm = this.fb.group(formControls);
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview'] && file.originFileObj) {
      file['preview'] = await getBase64(file.originFileObj as File);
    }

    this.previewImage = (file.url || file['preview']) as string;
    this.previewVisible = true;
  };

  beforeUpload = (file: NzUploadFile): boolean => {
    const rawFile = (file as any).originFileObj || file;

    this.fileList = [
      ...this.fileList,
      {
        uid: file.uid,
        name: file.name,
        status: 'done',
        originFileObj: rawFile as File
      }
    ];

    return false;
  };

  onSubmit(): void {
    if (this.createRoomRentalForm.invalid) {
      this.createRoomRentalForm.markAllAsTouched();
      return;
    }

    const formValue = this.createRoomRentalForm.value;
    const roomRentalDto = new CreateOrEditRoomRentalDto();

    roomRentalDto.id = 0;
    roomRentalDto.roomNumber = formValue.roomNumber?.trim() ?? undefined;
    roomRentalDto.roomType = formValue.roomType ?? undefined;
    roomRentalDto.statusRoom = formValue.statusRoom ?? undefined;
    roomRentalDto.note = formValue.note?.trim() ?? undefined;
    roomRentalDto.area = formValue.area ?? undefined;
    roomRentalDto.price = formValue.price ?? undefined;
    roomRentalDto.imagesDescription = [];

    const fileParameters = this.fileList
      .filter(file => !!file.originFileObj)
      .map(file => ({
        data: file.originFileObj as File,
        fileName: (file.originFileObj as File).name
      }));

    let request$: Observable<any>;

    if (fileParameters.length > 0) {
      request$ = this.serviceProxy.uploadImageDescription(fileParameters).pipe(
        switchMap((imagePaths: string[]) => {
          roomRentalDto.imagesDescription = imagePaths;
          return this.serviceProxy.createOrEdit(roomRentalDto);
        })
      );
    } else {
      request$ = this.serviceProxy.createOrEdit(roomRentalDto);
    }

    request$.subscribe({
      next: () => {
        this.createRoomRentalForm.reset();
        this.clearImages();
        this.saved.emit();
      },
      error: error => {
        console.error('Error creating room rental:', error);
        console.error('Error response:', error?.response);
      }
    });
  }

  private clearImages(): void {
    this.fileList = [];
    this.previewImage = '';
    this.previewVisible = false;
  }
}
