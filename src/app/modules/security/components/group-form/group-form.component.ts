import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {
  groupForm: UntypedFormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<GroupFormComponent>,
    private fb: UntypedFormBuilder
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  save() {
    if (this.groupForm.valid) {
      this.dialogRef.close(this.groupForm.value);
    }
  }

  private initForm() {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      permissions: [[]]
    });
    if (this.data && this.data.group) {
      this.groupForm.patchValue(this.data.group);
    }
  }
}
