import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';

interface DialogData {
  fecha_inicial: Date,
  fecha_final: Date
}

@Component({
  selector: 'app-date-range-dialog',
  templateUrl: './date-range-dialog.component.html',
  styleUrls: ['./date-range-dialog.component.scss']
})
export class DateRangeDialogComponent implements OnInit {
  range: UntypedFormGroup;
  constructor(
    public fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<DateRangeDialogComponent>,
  ) {
    this.range = this.fb.group({
      fecha_inicial: '',
      fecha_final: '',
    });
  }

  ngOnInit() {
  }

}
