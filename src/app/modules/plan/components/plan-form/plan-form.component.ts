import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Plan } from '../../../../models/plan.model';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.scss']
})
export class PlanFormComponent implements OnInit {
  form: UntypedFormGroup;
  @Output() saveData = new EventEmitter();
  @Input() plan: Plan;

  constructor(
    private fb: UntypedFormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.createForm();

  }
  async save() {
    if (this.form.invalid) {
      return;
    }
    this.saveData.emit(this.form.value);
  }

  private createForm() {
    this.form = this.fb.group({
      id: [this.plan?.id || ''],
      nombre: [this.plan?.nombre || '', [Validators.required]],
      descripcion: [this.plan?.descripcion || '', [Validators.required]],
      precio: [this.plan?.precio || '', [Validators.required]],
    });
  }

}
