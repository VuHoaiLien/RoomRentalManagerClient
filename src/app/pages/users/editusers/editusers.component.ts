import { Component, OnInit, Inject, Output, EventEmitter, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  API_BASE_URL,
  CreateOrEditUserDto,
  ServiceProxy
} from '../../../shared/services';
import { NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { CategoryCacheService } from '../../../shared/category-cache.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-users',
  templateUrl: './editusers.component.html',
  styleUrls: ['./editusers.component.css'],
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
  standalone: true
})
export class EditUsersComponent implements OnInit {
  editUserForm!: FormGroup;

  lstProvinces: any[] = [];
  lstDistricts: any[] = [];
  lstWards: any[] = [];
  lstRoleGroups: any[] = [];
  baseUrl?: string;

  @Output() saved = new EventEmitter<void>();

  controlRequestArray: Array<{
    label: string;
    key: string;
    type: string;
    options?: any[];
    placeholder?: string;
    validators?: any[];
  }> = [];

  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  constructor(
    private fb: FormBuilder,
    private serviceProxy: ServiceProxy,
    private memoryCache: CategoryCacheService,
    @Inject(NZ_MODAL_DATA) public data: { userData: any },
    @Optional() @Inject(API_BASE_URL) baseUrl: string
  ) {
    this.baseUrl = baseUrl;
    this.initializeFormControls();
  }

  ngOnInit(): void {
    this.lstDistricts = this.memoryCache.get('districts') || [];
    this.lstProvinces = this.memoryCache.get('provinces') || [];
    this.lstWards = this.memoryCache.get('wards') || [];
    this.lstRoleGroups = this.memoryCache.get('roleGroups') || [];

    this.initializeFormControls();

    if (this.data?.userData) {
      this.editUserForm.patchValue({
        id: this.data.userData.id ?? '',
        name: this.data.userData.name ?? '',
        email: this.data.userData.email ?? '',
        provinceCode: this.data.userData.provinceCode ?? '',
        districtCode: this.data.userData.districtCode ?? '',
        wardCode: this.data.userData.wardCode ?? '',
        address: this.data.userData.address ?? '',
        idCard: this.data.userData.idCard ?? '',
        job: this.data.userData.job ?? '',
        dateOfBirth: this.data.userData.dateOfBirth ? new Date(this.data.userData.dateOfBirth) : null,
        gender: this.data.userData.gender ?? '',
        roleGroupId: this.data.userData.roleGroupId ?? '',
        bikeId: this.data.userData.bikeId ?? '',
        phoneNumber: this.data.userData.phoneNumber ?? '',
        password: this.data.userData.password ?? ''
      });

      if (this.data.userData.avatar) {
        const avatarUrl = this.baseUrl
          ? `${this.baseUrl}${this.data.userData.avatar}`
          : this.data.userData.avatar;

        this.fileList = [
          {
            uid: 'existing-avatar',
            name: 'avatar',
            status: 'done',
            url: avatarUrl,
            thumbUrl: avatarUrl
          }
        ];
      }
    }
  }

  initializeFormControls(): void {
    this.controlRequestArray = [
      {
        label: 'Họ và tên',
        key: 'name',
        type: 'text',
        placeholder: 'Nhập họ tên',
        validators: [Validators.required]
      },
      {
        label: 'Email',
        key: 'email',
        type: 'text',
        placeholder: 'Nhập email',
        validators: [Validators.required, Validators.email]
      },
      {
        label: 'Tỉnh/Thành',
        key: 'provinceCode',
        type: 'select',
        options: this.lstProvinces,
        placeholder: 'Chọn tỉnh',
        validators: [Validators.required]
      },
      {
        label: 'Quận/Huyện',
        key: 'districtCode',
        type: 'select',
        options: this.lstDistricts,
        placeholder: 'Chọn quận',
        validators: [Validators.required]
      },
      {
        label: 'Phường/Xã',
        key: 'wardCode',
        type: 'select',
        options: this.lstWards,
        placeholder: 'Chọn phường',
        validators: [Validators.required]
      },
      {
        label: 'Địa chỉ',
        key: 'address',
        type: 'text',
        placeholder: 'Nhập địa chỉ',
        validators: [Validators.required]
      },
      {
        label: 'CMND/CCCD',
        key: 'idCard',
        type: 'text',
        placeholder: 'Nhập số CMND/CCCD',
        validators: [Validators.required]
      },
      {
        label: 'Nghề nghiệp',
        key: 'job',
        type: 'text',
        placeholder: 'Nhập nghề nghiệp',
        validators: [Validators.required]
      },
      {
        label: 'Ngày sinh',
        key: 'dateOfBirth',
        type: 'date',
        placeholder: '',
        validators: [Validators.required]
      },
      {
        label: 'Giới tính',
        key: 'gender',
        type: 'select',
        options: [
          { value: 'M', text: 'Nam' },
          { value: 'F', text: 'Nữ' }
        ],
        placeholder: 'Chọn giới tính',
        validators: [Validators.required]
      },
      {
        label: 'Nhóm quyền',
        key: 'roleGroupId',
        type: 'select',
        options: this.lstRoleGroups,
        placeholder: 'Chọn nhóm quyền',
        validators: [Validators.required]
      },
      {
        label: 'Xe (ID)',
        key: 'bikeId',
        type: 'text',
        placeholder: 'Nhập mã xe',
        validators: [Validators.required]
      },
      {
        label: 'Mật khẩu',
        key: 'password',
        type: 'text',
        placeholder: 'Nhập mật khẩu',
        validators: [Validators.required]
      },
      {
        label: 'SĐT',
        key: 'phoneNumber',
        type: 'text',
        placeholder: 'Nhập số điện thoại',
        validators: [Validators.required]
      },
      {
        label: 'Avatar',
        key: 'avatar',
        type: 'file',
        placeholder: 'Chọn ảnh đại diện'
      }
    ];

    const formControls: { [key: string]: any } = {};

    this.controlRequestArray.forEach(control => {
      formControls[control.key] = ['', control.validators || []];
    });

    this.editUserForm = this.fb.group(formControls);
  }

  trackByKey(index: number, item: any): string {
    return item.key;
  }

  trackByValue(index: number, item: any): any {
    return item?.value ?? index;
  }

  private async getBase64(file: File): Promise<string | ArrayBuffer | null> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview'] && file.originFileObj) {
      file['preview'] = await this.getBase64(file.originFileObj as File);
    }

    this.previewImage = (file.url || file['preview']) as string;
    this.previewVisible = true;
  };

  beforeUpload = (file: NzUploadFile): boolean => {
    const rawFile = (file as any).originFileObj || file;

    this.fileList = [
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
    if (this.editUserForm.invalid) {
      this.editUserForm.markAllAsTouched();
      return;
    }

    const formValue = this.editUserForm.value;
    const userDto = new CreateOrEditUserDto();

    userDto.id = this.data?.userData?.id ?? 0;
    userDto.name = formValue.name?.trim() ?? undefined;
    userDto.email = formValue.email?.trim() ?? undefined;
    userDto.provinceCode = formValue.provinceCode ?? undefined;
    userDto.districtCode = formValue.districtCode ?? undefined;
    userDto.wardCode = formValue.wardCode ?? undefined;
    userDto.address = formValue.address?.trim() ?? undefined;
    userDto.idCard = formValue.idCard?.trim() ?? undefined;
    userDto.job = formValue.job?.trim() ?? undefined;
    userDto.dateOfBirth = formValue.dateOfBirth ? new Date(formValue.dateOfBirth) : undefined;
    userDto.gender = formValue.gender ?? undefined;
    userDto.roleGroupId = formValue.roleGroupId ?? undefined;
    userDto.bikeId = formValue.bikeId ?? undefined;
    userDto.phoneNumber = formValue.phoneNumber?.trim() ?? undefined;
    userDto.password = formValue.password?.trim() ?? undefined;

    if (this.data?.userData?.avatar) {
      userDto.avatar = this.data.userData.avatar;
    }

    const newFiles = this.fileList
      .filter(file => !!file.originFileObj)
      .map(file => ({
        data: file.originFileObj as File,
        fileName: (file.originFileObj as File).name
      }));

    let request$: Observable<any>;

    if (newFiles.length > 0) {
      request$ = this.serviceProxy.uploadAvatar(newFiles).pipe(
        switchMap((imagePaths: string[]) => {
          if (imagePaths && imagePaths.length > 0) {
            userDto.avatar = imagePaths[0];
          }
          return this.serviceProxy.createOrEditUser(userDto);
        })
      );
    } else {
      request$ = this.serviceProxy.createOrEditUser(userDto);
    }

    request$.subscribe({
      next: () => {
        this.editUserForm.reset();
        this.clearImages();
        this.saved.emit();
      },
      error: (error) => {
        console.error('Error saving user:', error);
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
