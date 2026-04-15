import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CreateOrEditUserDto, ServiceProxy } from '../../../shared/services';
import { NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { CategoryCacheService } from '../../../shared/category-cache.service'; 

@Component({
  selector: 'app-create-users',
  templateUrl: './createusers.component.html',
  styleUrls: ['./createusers.component.css'],
  imports: [ReactiveFormsModule, NzFormItemComponent, NzFormLabelComponent,
    NzFormControlComponent, NzModalModule, NzInputModule, NzButtonModule,
    NzDatePickerModule, NzSelectModule, CommonModule, NzUploadModule, NzIconModule],
  standalone: true,
})
export class CreateUsersComponent implements OnInit {
  createUserForm: FormGroup;
  lstProvinces: any[] = [];
  lstDistricts: any[] = [];
  lstWards: any[] = [];
  lstRoleGroups: any[] = [];
  @Output() saved = new EventEmitter<void>();
  // dynamic controls array (for template loop)
  controlRequestArray: Array<{
    label: string;
    key: string;
    type: string;
    options?: any[];
    placeholder?: string;
    validators?: any[];
  }> = [];

  // upload related
  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  constructor(private fb: FormBuilder, private serviceProxy: ServiceProxy,private memoryCache: CategoryCacheService) {
    // initialize empty, we'll set up controls in initializeFormControls
    this.createUserForm = this.fb.group({});
  }

  private async getBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await this.getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  beforeUpload = (file: NzUploadFile): boolean => {
    // Keep file reference only; avoid creating object URLs to reduce memory/paint cost
    const uploadFile: NzUploadFile = {
      uid: file.uid,
      name: file.name,
      status: 'done',
      originFileObj: (file as any).originFileObj || (file as any)
    } as NzUploadFile;
    this.fileList = [...this.fileList, uploadFile];
    return false;
  };

  initializeFormControls(): void {
    // Use arrays for options to avoid function calls inside template (improves performance)
    this.controlRequestArray = [
      { label: 'Họ và tên', key: 'name', type: 'text', placeholder: 'Nhập họ tên', validators: [Validators.required] },
      { label: 'Email', key: 'email', type: 'text', placeholder: 'Nhập email', validators: [Validators.required, Validators.email] },
      { label: 'Tỉnh/Thành', key: 'provinceCode', type: 'select', options: this.lstProvinces, placeholder: 'Chọn tỉnh', validators: [Validators.required] },
      { label: 'Quận/Huyện', key: 'districtCode', type: 'select', options: this.lstDistricts, placeholder: 'Chọn quận', validators: [Validators.required] },
      { label: 'Phường/Xã', key: 'wardCode', type: 'select', options: this.lstWards, placeholder: 'Chọn phường', validators: [Validators.required] },
      { label: 'Địa chỉ', key: 'address', type: 'text', placeholder: 'Nhập địa chỉ', validators: [Validators.required] },
      { label: 'CMND/CCCD', key: 'idCard', type: 'text', placeholder: 'Nhập số CMND/CCCD', validators: [Validators.required] },
      { label: 'Nghề nghiệp', key: 'job', type: 'text', placeholder: 'Nhập nghề nghiệp', validators: [Validators.required] },
      { label: 'Ngày sinh', key: 'dateOfBirth', type: 'date', placeholder: '', validators: [Validators.required] },
      { label: 'Giới tính', key: 'gender', type: 'select', options: [{ value: 'M', text: 'Nam' }, { value: 'F', text: 'Nữ' }], placeholder: 'Chọn giới tính', validators: [Validators.required] },
      { label: 'Nhóm quyền', key: 'roleGroupId', type: 'select', options: this.lstRoleGroups, placeholder: 'Chọn nhóm quyền', validators: [Validators.required] },
      { label: 'Xe (ID)', key: 'bikeId', type: 'text', placeholder: 'Nhập mã xe', validators: [Validators.required] },
      { label: 'Mật khẩu', key: 'password', type: 'text', placeholder: 'Nhập mật khẩu', validators: [Validators.required] },
      { label: 'SĐT', key: 'phoneNumber', type: 'text', placeholder: 'Nhập số điện thoại', validators: [Validators.required] },
      { label: 'Avatar', key: 'avatar', type: 'file', placeholder: 'Chọn ảnh đại diện' }
    ];

    const formControls: { [key: string]: any } = {};
    this.controlRequestArray.forEach(control => {
      formControls[control.key] = ['', control.validators || []];
    });
    this.createUserForm = this.fb.group(formControls);
  }

  // trackBy for ngFor to reduce DOM churn
  trackByKey(index: number, item: any): string {
    return item.key;
  }

  trackByValue(index: number, item: any): any {
    return item?.value ?? index;
  }

  onSubmit(): void {
    if (this.createUserForm.valid) {
      const userDto: CreateOrEditUserDto = this.createUserForm.value;
      const fileParameters = this.fileList
        .filter(file => file.originFileObj)
        .map(file => ({
          data: file.originFileObj as File,
          fileName: file.originFileObj ? (file.originFileObj as File).name : file.name
        }));

      // upload avatar first (if any), then create user
      this.serviceProxy.uploadAvatar(fileParameters).pipe(
        switchMap(imagePaths => {
          userDto.avatar = imagePaths[0];
          userDto.id = 0; // Set ID to 0 for new creation
          return this.serviceProxy.createOrEditUser(userDto);
        })
      ).subscribe(() => {
        this.createUserForm.reset();
        this.clearImages();
        this.saved.emit();
      }, error => {
        console.error('Error creating user:', error);
      });
    }
  }
  ngOnInit(): void {
    this.lstDistricts = this.memoryCache.get('districts') || [];
    this.lstProvinces = this.memoryCache.get('provinces') || [];
    this.lstWards = this.memoryCache.get('wards') || [];
    this.lstRoleGroups = this.memoryCache.get('roleGroups') || [];
    // initialize controls after cached lists loaded
    this.initializeFormControls();
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
}