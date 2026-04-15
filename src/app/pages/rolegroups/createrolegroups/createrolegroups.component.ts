import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener, NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { CategoryCacheService } from '../../../shared/category-cache.service';
import { SelectListItemService } from '../../../shared/get-select-list-item.service';
import { CreateOrEditRoleGroupDto, PermissionDto, RoleDto, SelectListItem, ServiceProxy } from '../../../shared/services';
import { Observable, tap } from 'rxjs';
interface TreeNode {
    name: string;
    disabled?: boolean;
    children?: TreeNode[];
    id?: number;
}

const TREE_DATA: TreeNode[] = [];

interface FlatNode {
    expandable: boolean;
    name: string;
    level: number;
    disabled?: boolean;
}

@Component({
    selector: 'app-createroomrentals',
    imports: [ReactiveFormsModule, NzFormItemComponent, NzFormLabelComponent,
        NzFormControlComponent, NzModalModule, NzInputModule, NzButtonModule,
        CommonModule, NzIconModule, NzSwitchModule, NzTreeViewModule],
    templateUrl: './createrolegroups.component.html',
    styleUrl: './createrolegroups.component.css'
})

export class CreateRoleGroupsComponent implements OnInit {
    createRoleGroupForm!: FormGroup;
    lstUser: SelectListItem[] = [];
    previewVisible = false;
    @Output() saved = new EventEmitter<void>();
    private transformer = (node: TreeNode, level: number): FlatNode => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode = existingNode && existingNode.name === node.name
            ? existingNode
            : {
                expandable: !!node.children && node.children.length > 0,
                name: node.name,
                level,
                disabled: !!node.disabled
            };
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    }
    flatNodeMap = new Map<FlatNode, TreeNode>();
    nestedNodeMap = new Map<TreeNode, FlatNode>();
    checklistSelection = new SelectionModel<FlatNode>(true);
    treeControl = new FlatTreeControl<FlatNode>(
        node => node.level,
        node => node.expandable
    );

    treeFlattener = new NzTreeFlattener(
        this.transformer,
        node => node.level,
        node => node.expandable,
        node => node.children
    );

    dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);
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
        this.createRoleGroupForm = this.fb.group({
            roleGroupName: ['', Validators.required],
            active: ['', Validators.required]
        });
        this.dataSource.setData(TREE_DATA);
    }

    hasChild = (_: number, node: FlatNode): boolean => node.expandable;

    descendantsAllSelected(node: FlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        return descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
    }
    descendantsPartiallySelected(node: FlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    leafItemSelectionToggle(node: FlatNode): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);
    }

    itemSelectionToggle(node: FlatNode): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);

        descendants.forEach(child => this.checklistSelection.isSelected(child));
        this.checkAllParentsSelection(node);
    }

    checkAllParentsSelection(node: FlatNode): void {
        let parent: FlatNode | null = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    checkRootNodeSelection(node: FlatNode): void {
        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected =
            descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
        if (nodeSelected && !descAllSelected) {
            this.checklistSelection.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
            this.checklistSelection.select(node);
        }
    }

    getParentNode(node: FlatNode): FlatNode | null {
        const currentLevel = node.level;

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];

            if (currentNode.level < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }
    initializeFormControls(): void {
        // Định nghĩa các field cho form tạo mới
        this.controlRequestArray = [
            {
                label: 'Tên nhóm quyền',
                key: 'name',
                type: 'text',
                placeholder: 'Nhập tên nhóm quyền'
            },
            {
                label: 'Trạng thái',
                key: 'active',
                type: 'bool',
                placeholder: 'Chọn trạng thái',
                validators: []
            },
            {
                label: "Nhóm quyền",
                key: 'roleDtos',
                type: 'tree',
                placeholder: 'Chọn nhóm quyền',
            },
            {
                label: 'Mô tả',
                key: 'descriptions',
                type: 'text',
                placeholder: 'Nhập mô tả',
            }
        ];

        // Tạo FormGroup động dựa trên controlRequestArray
        const formControls: { [key: string]: any } = {};
        this.controlRequestArray.forEach(control => {
            formControls[control.key] = ['', control.validators || []];
        });

        this.createRoleGroupForm = this.fb.group(formControls);
    }

    onSubmit(): void {
        if (this.createRoleGroupForm.valid) {
            const roleGroupDto: CreateOrEditRoleGroupDto = this.createRoleGroupForm.value;
            const selectedFlat = this.checklistSelection.selected;

            // Map theo roleId -> { roleName, permissions }
            const roleMap = new Map<number, { roleName: string; permissions: PermissionDto[] }>();

            selectedFlat.forEach(node => {
                const treeNode = this.flatNodeMap.get(node);
                if (!treeNode) return;

                if (node.expandable) {
                    // Parent node được chọn: lấy tất cả descendants làm permission
                    const descendants = this.treeControl.getDescendants(node)
                        .filter(d => !d.expandable); // chỉ lấy leaf là permission
                    const permissions = descendants
                        .map(d => this.flatNodeMap.get(d))
                        .filter((n): n is TreeNode => !!n)
                        .map(p => new PermissionDto({ id: p.id || 0, name: p.name }));

                    const roleId = treeNode.id || 0;
                    roleMap.set(roleId, { roleName: treeNode.name, permissions });
                } else {
                    // Leaf node được chọn: tìm parent (role) và thêm permission vào role đó
                    let parent = this.getParentNode(node);
                    let roleId: number;
                    let roleName: string;

                    if (parent) {
                        const parentTree = this.flatNodeMap.get(parent);
                        roleId = parentTree?.id || 0;
                        roleName = parentTree?.name || '';
                    } else {
                        // Trường hợp leaf ở cấp top (không có parent) => coi chính nó là role
                        roleId = treeNode.id || 0;
                        roleName = treeNode.name;
                    }

                    const existing = roleMap.get(roleId);
                    const perm = new PermissionDto({ id: treeNode.id || 0, name: treeNode.name });
                    if (existing) {
                        // tránh thêm trùng lặp permission theo id
                        if (!existing.permissions.some(p => p.id === perm.id)) {
                            existing.permissions.push(perm);
                        }
                    } else {
                        roleMap.set(roleId, { roleName, permissions: [perm] });
                    }
                }
            });

            // Chuyển map thành mảng RoleDto
            const roleDtos: RoleDto[] = [];
            roleMap.forEach((value, key) => {
                const uniquePermissions = Array.from(
                    new Map(value.permissions.map(p => [p.id, p])).values()
                );
                const roleDto = new RoleDto({ id: key, name: value.roleName, permissions: uniquePermissions });
                roleDtos.push(roleDto);
            });

            roleGroupDto.id = 0; // Set ID to 0 for new creation
            roleGroupDto.roleDtos = roleDtos;
            this.serviceProxy.createOrEditRoleGroup(roleGroupDto).subscribe(() => {
                this.createRoleGroupForm.reset();
                this.saved.emit();
            }, error => {
                console.error('Error creating role group:', error);
            });
        }
    }

    onMapRolesToTree(roles: RoleDto[]): void {
        // Giả sử lstUser là mảng các quyền đã lấy từ API
       const treeData: TreeNode[] = roles.map(role => {
            const node: TreeNode = {
                id: role.id || 0,
                name: role.name || '',
                disabled: false,
                children: role.permissions?.map(permission => ({
                    name: permission.name || '',
                    id: permission.id || 0,
                    disabled: false
                })) || []
            };
            return node;
        });
        this.dataSource.setData(treeData);
        localStorage.setItem('role_tree_data', JSON.stringify(treeData));
    }

    ngOnInit(): void {
        this.initializeFormControls();
        this.serviceProxy.getAllRole().pipe(
            tap(result => {
                this.onMapRolesToTree(result);
            })
        ).subscribe();
    }
}
