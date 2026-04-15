import { Component, OnInit, Input, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API_BASE_URL, SelectListItem, ServiceProxy } from '../../../shared/services';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { CategoryCacheService } from '../../../shared/category-cache.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { forkJoin, of } from 'rxjs';
import { SelectListItemService } from '../../../shared/get-select-list-item.service';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
const getBase64 = (file: File): Promise<string | ArrayBuffer | null> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});
@Component({
  selector: 'app-editroomrentals',
  imports: [ReactiveFormsModule, NzFormItemComponent, NzFormLabelComponent,
    NzFormControlComponent, NzModalModule, NzInputModule, NzButtonModule,
    NzDatePickerModule, NzSelectModule, CommonModule, NzIconModule, NzUploadModule],
  templateUrl: './editroomrentals.component.html',
  styleUrl: './editroomrentals.component.css'
})
export class EditRoomRentalsComponent {
  lstUser: SelectListItem[] = [];
  lstRoomTypes: SelectListItem[] = [];
  lstRoomStatuses: SelectListItem[] = [];
  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  editRoomRentalForm: FormGroup;
  baseUrl?: string;
  constructor(private fb: FormBuilder, private serviceProxy: ServiceProxy, private memoryCache: CategoryCacheService,
    private _getSelectListItem: SelectListItemService, @Inject(NZ_MODAL_DATA) public data: { roomrentalData: any },
    @Optional() @Inject(API_BASE_URL) baseUrl: string) {
    this.baseUrl = baseUrl;
    // Initialize form with basic structure first
    this.editRoomRentalForm = this.fb.group({
      id: [''],
      roomNumber: ['', Validators.required],
      roomType: ['', Validators.required],
      price: ['', Validators.required],
      statusRoom: ['', Validators.required],
      note: [''],
      area: ['', Validators.required],
      createdDate: [''],
      updatedDate: [''],
      creatorUser: [''],
      lastUpdateUser: [''],
      imagesDescription: ['']
    });
  }
  controlRequestArray: Array<{
    label: string;
    key: string;
    type: string;
    options?: () => SelectListItem[];
    placeholder?: string;
    validators?: any[];
  }> = [];

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
    if (file instanceof File) {
      rawFile = file;
      uploadFile = {
        ...file,
        originFileObj: file,
        status: 'done',
        thumnbUrl: URL.createObjectURL(file)
      }
    }
    else {
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

        // Fill dữ liệu vào form SAU KHI đã có tất cả select lists
        this.populateFormData();
      },
        error => {
          console.error('Error fetching data:', error);
        }
      );
  }

  initializeFormControls(): void {
    // Định nghĩa các field cho form chỉnh sửa (chỉ những field có thể edit)
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
  }

  populateFormData(): void {
    // Fill dữ liệu vào form nếu có
    if (this.data && this.data.roomrentalData) {
      console.log('Populating form with data:', this.data.roomrentalData);

      // Ensure the form values match the select options
      const formData = { ...this.data.roomrentalData };

      // Convert enum values to match select options if needed
      if (formData.roomType !== undefined) {
        formData.roomType = formData.roomType.toString();
      }
      if (formData.statusRoom !== undefined) {
        formData.statusRoom = formData.statusRoom.toString();
      }

      this.editRoomRentalForm.patchValue(formData);

      console.log('Form after patch:', this.editRoomRentalForm.value);

      // Handle image descriptions if available
      if (this.data.roomrentalData.imagesDescription && this.data.roomrentalData.imagesDescription.length > 0) {
        this.fileList = this.data.roomrentalData.imagesDescription.map((img: any, index: number) => ({
          uid: `${index}`,
          name: `image-${index}`,
          status: 'done',
          url: (this.baseUrl ?? '') + img,
          thumbUrl: (this.baseUrl ?? '') + img
        }));
      }
    }
  }

  onSubmit(): void {
    if (this.editRoomRentalForm.valid) {
      const formData = this.editRoomRentalForm.value;
      // Handle file list if needed
      if (this.fileList && this.fileList.length > 0) {
        formData.imageDescriptions = this.fileList.map(file => ({
          imageUrl: file.url || file.thumbUrl,
          description: file.name
        }));
      }

      console.log('Form data to submit:', formData);

      // Call the service to update room rental
      // this.serviceProxy.updateRoomRental(formData).subscribe(() => {
      //   alert('Phòng cho thuê đã được cập nhật thành công!');
      //   // Close modal and refresh parent data
      // });

      // For now, just log the data
      alert('Dữ liệu sẵn sàng để cập nhật!');
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.editRoomRentalForm.controls).forEach(key => {
        this.editRoomRentalForm.get(key)?.markAsTouched();
      });
    }
  }
}
