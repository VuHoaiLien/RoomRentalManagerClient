import { Component, EventEmitter, Output, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  API_BASE_URL,
  SelectListItem,
  ServiceProxy,
  CreateOrEditRoomRentalDto
} from '../../../shared/services';
import { NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { CategoryCacheService } from '../../../shared/category-cache.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { forkJoin, of, switchMap } from 'rxjs';
import { SelectListItemService } from '../../../shared/get-select-list-item.service';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

@Component({
  selector: 'app-editroomrentals',
  standalone: true,
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
    NzIconModule,
    NzUploadModule
  ],
  templateUrl: './editroomrentals.component.html',
  styleUrls: ['./editroomrentals.component.css']
})
export class EditRoomRentalsComponent {
  @Output() saved = new EventEmitter<void>();

  lstUser: SelectListItem[] = [];
  lstRoomTypes: SelectListItem[] = [];
  lstRoomStatuses: SelectListItem[] = [];

  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  editRoomRentalForm: FormGroup;
  baseUrl?: string;

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
    private getSelectListItemService: SelectListItemService,
    private modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public data: { roomrentalData: any },
    @Optional() @Inject(API_BASE_URL) baseUrl: string
  ) {
    this.baseUrl = baseUrl;

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
          this.memoryCache.set('user', this.lstUser);
        }
        if (!cachedRoomTypes) {
          this.memoryCache.set('roomType', this.lstRoomTypes);
        }
        if (!cachedRoomStatus) {
          this.memoryCache.set('roomStatus', this.lstRoomStatuses);
        }

        this.initializeFormControls();
        this.populateFormData();
      },
      error: (error) => {
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
  }

  populateFormData(): void {
    if (!this.data?.roomrentalData) {
      return;
    }

    const formData = { ...this.data.roomrentalData };

    if (formData.roomType !== undefined && formData.roomType !== null) {
      formData.roomType = formData.roomType.toString();
    }

    if (formData.statusRoom !== undefined && formData.statusRoom !== null) {
      formData.statusRoom = formData.statusRoom.toString();
    }

    if (formData.roomNumber !== undefined && formData.roomNumber !== null) {
      formData.roomNumber = formData.roomNumber.toString();
    }

    if (formData.price !== undefined && formData.price !== null) {
      formData.price = formData.price.toString();
    }

    if (formData.area !== undefined && formData.area !== null) {
      formData.area = formData.area.toString();
    }

    this.editRoomRentalForm.patchValue(formData);

    if (this.data.roomrentalData.imagesDescription && this.data.roomrentalData.imagesDescription.length > 0) {
      this.fileList = this.data.roomrentalData.imagesDescription.map((img: string, index: number) => ({
        uid: `existing-${index}`,
        name: `image-${index}`,
        status: 'done',
        url: (this.baseUrl ?? '') + img,
        thumbUrl: (this.baseUrl ?? '') + img
      }));
    }
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview'] && file.originFileObj) {
      file['preview'] = await getBase64(file.originFileObj as File);
    }

    this.previewImage = (file.url || file.thumbUrl || file['preview']) as string;
    this.previewVisible = true;
  };

  beforeUpload = (file: NzUploadFile): boolean => {
    const rawFile = (file as any).originFileObj || file;

    if (!(rawFile instanceof File)) {
      return false;
    }

    const previewUrl = URL.createObjectURL(rawFile);

    const uploadFile: NzUploadFile = {
      uid: file.uid,
      name: file.name,
      status: 'done',
      originFileObj: rawFile,
      thumbUrl: previewUrl,
      url: previewUrl
    };

    this.fileList = [...this.fileList, uploadFile];
    return false;
  };

  onSubmit(): void {
    console.log('onSubmit called');

    if (this.editRoomRentalForm.invalid) {
      this.editRoomRentalForm.markAllAsTouched();
      console.log('Form invalid:', this.editRoomRentalForm.value, this.editRoomRentalForm.errors);
      return;
    }

    const form = this.editRoomRentalForm.value;
    const dto = new CreateOrEditRoomRentalDto();

    dto.id = form.id;
    dto.roomNumber = form.roomNumber?.toString();
    dto.roomType = form.roomType ?? undefined;
    dto.statusRoom = form.statusRoom ?? undefined;
    dto.price = form.price?.toString();
    dto.area = form.area?.toString();
    dto.note = form.note ?? undefined;

    const newFiles = this.fileList
      .filter(file => !!file.originFileObj)
      .map(file => ({
        data: file.originFileObj as File,
        fileName: (file.originFileObj as File).name
      }));

    console.log('DTO before save:', dto);
    console.log('New files:', newFiles);

    if (newFiles.length > 0) {
      this.serviceProxy.uploadImageDescription(newFiles).pipe(
        switchMap((paths: string[]) => {
          dto.imagesDescription = paths;
          console.log('DTO before createOrEdit with new images:', dto);
          return this.serviceProxy.createOrEdit(dto);
        })
      ).subscribe({
        next: (res) => {
          console.log('Update success:', res);
          this.clearImages();
          this.saved.emit();
          this.modalRef.close();
        },
        error: (error) => {
          console.error('Error updating room rental:', error);
          console.error('Error response:', error?.response);
        }
      });
    } else {
      dto.imagesDescription = this.data?.roomrentalData?.imagesDescription || [];
      console.log('DTO before createOrEdit without new images:', dto);

      this.serviceProxy.createOrEdit(dto).subscribe({
        next: (res) => {
          console.log('Update success:', res);
          this.clearImages();
          this.saved.emit();
          this.modalRef.close();
        },
        error: (error) => {
          console.error('Error updating room rental:', error);
          console.error('Error response:', error?.response);
        }
      });
    }
  }

  closeModal(): void {
    this.modalRef.close();
  }

  private clearImages(): void {
    this.fileList.forEach(file => {
      if (file.url && file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url);
      }
      if (file.thumbUrl && file.thumbUrl.startsWith('blob:')) {
        URL.revokeObjectURL(file.thumbUrl);
      }
    });

    this.fileList = [];
    this.previewImage = '';
    this.previewVisible = false;
  }
}
