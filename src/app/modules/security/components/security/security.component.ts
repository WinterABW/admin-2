import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupFormComponent } from '../group-form/group-form.component';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/models/group';
import { Permission } from 'src/app/models/permission';
import { PermissionService } from 'src/app/services/permission.service';
import { ConfirmDialogComponent } from 'src/app/common/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  selectedPermissions: any;
  changed: boolean;
  selectedGroup: any;
  groups: Group[];
  selectedIndex: number = 0;
  @ViewChild('permissionsSelected') permissionsSelected: MatSelectionList;
  permissionFilterControl = new UntypedFormControl('');
  filteredPermissions: Permission[];
  permissions: Permission[];

  constructor(
    private groupService: GroupService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService
  ) {
  }

  ngOnInit(): void {
    this.loadGroups()
    this.loadPermissions()
    this.listenFilter()
  }

  restore() {
    this.selectedPermissions = this.selectedGroup.permissions.map(p => p.id);
    this.changed = false;
  }
  saveChanges() {
    if (this.changed) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirmación',
          msg: '¿Está seguro que desea guardar los cambios realizados?'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.groupService.update({ id: this.selectedGroup.id, permissions: this.selectedPermissions }).subscribe(
            () => {
              this.snackBar.open('Cambios guardados correctamente.');
              this.loadGroups();
              this.changed = false;
            },
            () => {
              this.snackBar.open('Error al guardar los cambios.');
              this.changed = false;
            }
          );
        }
      });
    }
  }
  private loadGroups() {
    this.groupService.getAll().subscribe(data => {

      this.groups = data.results.sort((a, b) => a.name.localeCompare(b.name));
      /* console.log('Grupo de roles: ', this.groups); */

      this.selectedGroup = this.groups[this.selectedIndex];
      /* console.log('Grupo select: ', this.selectedGroup); */

      this.selectedPermissions = this.selectedGroup.permissions.map(p => p.id);
    });
  }
  private loadPermissions() {
    this.permissionService.getAll().subscribe(data => {
      this.permissions = data.results;
      this.filteredPermissions = this.permissions;
    });
  }
  newGroup() {
    const ref = this.dialog.open(GroupFormComponent);
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.groupService.create(result).subscribe(created => {
          this.snackBar.open('Grupo creado correctamente.');
          this.loadGroups();
        });
      }
    });
  }
  selectGroup(index: number) {
    if (this.changed) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirmación',
          msg: 'Hay cambios sin guardar. Al cambiar de grupo perderá los cambios realizados. ¿Desea continuar?'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.selectedIndex = index;
          this.selectedGroup = this.groups[index];
          this.selectedPermissions = this.selectedGroup.permissions.map(p => p.id);
          this.changed = false;
        }
      });

    } else {
      this.selectedIndex = index;
      this.selectedGroup = this.groups[index];
      this.selectedPermissions = this.selectedGroup.permissions.map(p => p.id);
    }
    /* console.log('ID: ', this.selectedIndex); */

  }
  toggleSelectAll({ checked }) {
    this.changed = true;
    checked ? this.permissionsSelected.selectAll() : this.permissionsSelected.deselectAll();
  }
  changeSelection() {
    this.changed = true;
  }
  delete(group: Group) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        msg: '¿Está seguro que desea eliminar este grupo?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupService.delete(group.id).subscribe(
          () => {
            this.snackBar.open('Grupo eliminado correctamente.');
            this.loadGroups();
          },
          () => {
            this.snackBar.open('Error al eliminar el grupo.');
          }
        );
      }
    });
  }
  private listenFilter() {
    this.permissionFilterControl.valueChanges.pipe(
      debounceTime(500)
    ).subscribe((value: string) => {
      if (value) {
        this.filteredPermissions = this.permissions.filter(p => p.nombre.toLowerCase().includes(value.toLowerCase()));
        this.selectedPermissions = this.selectedGroup.permissions.map(p => p.id);
      } else {
        this.filteredPermissions = this.permissions;
        this.selectedPermissions = this.selectedGroup.permissions.map(p => p.id);
      }
    });
  }

}

