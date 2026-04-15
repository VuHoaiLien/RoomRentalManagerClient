import { CreateOrEditRoomRentalDto, SelectListItem, ServiceProxy } from '../../../shared/services';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { CategoryCacheService } from '../../../shared/category-cache.service';
import { SelectListItemService } from '../../../shared/get-select-list-item.service';
import { forkJoin, of, switchMap } from 'rxjs';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
const getBase64 = (file: File): Promise<string | ArrayBuffer | null> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});
@Component({
  selector: 'app-createroomrentals',
  imports: [ReactiveFormsModule, NzFormItemComponent, NzFormLabelComponent,
    NzFormControlComponent, NzModalModule, NzInputModule, NzButtonModule,
    NzDatePickerModule, NzSelectModule, CommonModule, NzUploadModule, NzIconModule],
  templateUrl: './createroomrentals.component.html',
  styleUrl: './createroomrentals.component.css'
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

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };
  beforeUpload = (file: NzUploadFile): boolean => {
    let rawFile: File | undefined;
    let uploadFile: NzUploadFile | undefined;
    if(file instanceof File) {
      rawFile = file;
      uploadFile = {
        ...file,
        originFileObj: file,
        status: 'done',
        thumnbUrl: URL.createObjectURL(file)
      }
    }
    else
    {
      rawFile = file.originFileObj;
      uploadFile = {
        ...file,
        originFileObj: file.originFileObj,
        status: 'done',
        thumnbUrl: file.url
      };
    }
    this.fileList = [...this.fileList, uploadFile!];
    return false; 
  };
  // Sử dụng lại cấu trúc controlRequestArray từ parent component
  controlRequestArray: Array<{
    label: string;
    key: string;
    type: string;
    options?: () => SelectListItem[];
    placeholder?: string;
    validators?: any[];
  }> = [];

  constructor(private fb: FormBuilder, private serviceProxy: ServiceProxy, private memoryCache: CategoryCacheService, private _getSelectListItem: SelectListItemService) {
    this.createRoomRentalForm = this.fb.group({
      roomNumber: ['', Validators.required],
      roomType: ['', Validators.required],
      roomStatus: ['', Validators.required],
      description: ['', Validators.required],
      area: ['', Validators.required]
    });
  }

  initializeFormControls(): void {
    // Định nghĩa các field cho form tạo mới
    this.controlRequestArray = [
      {
        label: 'Số phòng',
        key: 'roomNumber',
        type: 'text',
        placeholder: 'Nhập số phòng'
      },
      {
        label: 'Loại phòng',
        key: 'roomType',
        type: 'select',
        options: () => this.lstRoomTypes,
        placeholder: 'Chọn loại phòng'
      },
      {
        label: 'Trạng thái phòng',
        key: 'statusRoom',
        type: 'select',
        options: () => this.lstRoomStatuses,
        placeholder: 'Chọn trạng thái phòng'
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
        placeholder: 'Nhập diện tích (m²)'
      },
      {
        label: 'Giá',
        key: 'price',
        type: 'number',
        placeholder: 'Nhập giá phòng',
      },
      {
        label: "Ảnh mô tả",
        key: 'imagesDescription',
        type: 'file',
        placeholder: 'Chọn ảnh mô tả',
      }
    ];

    // Tạo FormGroup động dựa trên controlRequestArray
    const formControls: { [key: string]: any } = {};
    this.controlRequestArray.forEach(control => {
      formControls[control.key] = ['', control.validators || []];
    });

    this.createRoomRentalForm = this.fb.group(formControls);
  }

  onSubmit(): void {
    if (this.createRoomRentalForm.valid) {
      const roomRentalDto: CreateOrEditRoomRentalDto = this.createRoomRentalForm.value;
      roomRentalDto.roomType = roomRentalDto.roomType !== undefined ? Number(roomRentalDto.roomType) : 0;
      roomRentalDto.statusRoom = roomRentalDto.statusRoom !== undefined ? Number(roomRentalDto.statusRoom) : 0;
      const fileParameters = this.fileList
        .filter(file => file.originFileObj)
        .map(file => ({
          data: file.originFileObj as File,
          fileName: file.originFileObj ? (file.originFileObj as File).name : file.name
        }));
      this.serviceProxy.uploadImageDescription(fileParameters).pipe(
        switchMap(imagePaths => {
          roomRentalDto.imagesDescription = imagePaths;
          roomRentalDto.id = 0; // Set ID to 0 for new creation
          return this.serviceProxy.createOrEdit(roomRentalDto);
        })
      ).subscribe(() => {
        this.createRoomRentalForm.reset();
        this.clearImages();
        this.saved.emit();
      }, error => {
        console.error('Error creating room rental:', error);
      });
    }
  }

  private clearImages(): void {
    // Revoke any object URLs created with URL.createObjectURL to avoid memory leaks
    this.fileList.forEach(f => {
      const thumb = (f as any).thumnbUrl;
      if (typeof thumb === 'string' && thumb.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(thumb);
        } catch (e) {
          // ignore revoke errors
        }
      }
    });
    this.fileList = [];
    this.previewImage = '';
    this.previewVisible = false;
  }
  ngOnInit(): void {
    const cachedRoomTypes = this.memoryCache.get<SelectListItem[]>('roomType');
    const cachedRoomStatus = this.memoryCache.get<SelectListItem[]>('roomStatus');
    const cachedUsers = this.memoryCache.get<SelectListItem[]>('user');
    const userObservable$ = cachedUsers ? of(cachedUsers) : this._getSelectListItem.getSelectListItems("user", "");
    const roomTypeObservable$ = cachedRoomTypes ? of(cachedRoomTypes) : this._getSelectListItem.getEnumSelectListItems("roomType");
    const roomStatusObservable$ = cachedRoomStatus ? of(cachedRoomStatus) : this._getSelectListItem.getEnumSelectListItems("roomStatus");
    forkJoin([userObservable$, roomTypeObservable$, roomStatusObservable$])
      .subscribe(([users, roomTypes, roomStatus]) => {
        this.lstUser = users ? users : [];
        this.lstRoomTypes = roomTypes ? roomTypes : [];
        this.lstRoomStatuses = roomStatus ? roomStatus : [];
        if (!cachedUsers) this.memoryCache.set('user', users);
        if (!cachedRoomTypes) this.memoryCache.set('roomType', roomTypes);
        if (!roomStatus) this.memoryCache.set('roomStatus', roomStatus);

        // Khởi tạo controlRequestArray sau khi có dữ liệu
        this.initializeFormControls();
      },
        error => {
          console.error('Error fetching data:', error);
        }
      );
  }

}
