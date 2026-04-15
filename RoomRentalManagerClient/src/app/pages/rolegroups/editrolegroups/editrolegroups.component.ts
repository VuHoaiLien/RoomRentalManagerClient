import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleDto, SelectListItem, ServiceProxy } from "../../../shared/services";
import { CategoryCacheService } from "../../../shared/category-cache.service";
import { SelectListItemService } from "../../../shared/get-select-list-item.service";
import { NZ_MODAL_DATA } from "ng-zorro-antd/modal";
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener, NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { tap } from 'rxjs';
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
    selector: 'app-editrolegroups',
    imports: [NzButtonModule, NzFormItemComponent, NzFormLabelComponent,ReactiveFormsModule, CommonModule,
        NzFormControlComponent, NzModalModule, NzInputModule, NzIconModule, NzSwitchModule, NzTreeViewModule],
    templateUrl: './editrolegroups.component.html',
    styleUrl: './editrolegroups.component.css'
})
export class EditRoleGroupsComponent implements OnInit {
    isLoading = false;
    editRoleGroupForm: FormGroup;
    controlRequestArray: Array<{
            label: string;
            key: string;
            type: string;
            options?: () => SelectListItem[];
            placeholder?: string;
            validators?: any[];
        }> = [];
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
    constructor(private fb: FormBuilder, private serviceProxy: ServiceProxy, private memoryCache: CategoryCacheService,
        private _getSelectListItem: SelectListItemService, @Inject(NZ_MODAL_DATA) public data: { roleGroupData: any }) {
        // Initialize form with basic structure first
        this.editRoleGroupForm = this.fb.group({
            id: [''],
            name: ['', Validators.required],
            descriptions: ['', Validators.required],
            active: [true],
            creatorUser: [''],
            lastUpdateUser: [''],
            createdAt: [''],
            updatedAt: ['']
        });
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

    ngOnInit(): void {
        this.initializeFormControls();
        if(this.data && this.data.roleGroupData) {
            const roleTreeData = localStorage.getItem('role_tree_data');
            if(roleTreeData){
                this.dataSource.setData(roleTreeData ? JSON.parse(roleTreeData) : TREE_DATA);
            }
            else{
                this.serviceProxy.getAllRole().pipe(
                            tap(result => {
                                this.onMapRolesToTree(result);
                            })
                        ).subscribe();
            }
            this.serviceProxy.getActivePermission(this.data.roleGroupData.id).subscribe((permissions: number[]) => {
                // Duyệt qua tất cả các nút trong cây và chọn những nút có trong danh sách permissions
                this.treeControl.dataNodes.forEach(node => {
                    var idPermission = this.flatNodeMap.get(node)?.id;
                    if (idPermission && permissions.includes(idPermission)) {
                        this.checklistSelection.select(node);
                    } 
                });
            });
            this.editRoleGroupForm.patchValue(this.data.roleGroupData);
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

    onSubmit(): void {

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

        this.editRoleGroupForm = this.fb.group(formControls);
    }
}