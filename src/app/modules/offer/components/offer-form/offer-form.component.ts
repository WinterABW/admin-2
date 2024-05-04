import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UtilesService } from '../../../../services/utiles.service';

@Component({
  selector: 'app-offer-form',
  templateUrl: './offer-form.component.html',
  styleUrls: ['./offer-form.component.scss']
})
export class OfferFormComponent implements OnInit {
  form: UntypedFormGroup;
  @Input() offer;
  @Input() operation: 'Adicionar' | 'Editar' = 'Adicionar';
  @Output() saveData = new EventEmitter();

  constructor(
    private fb: UntypedFormBuilder,
    private utilesService: UtilesService
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  save() {
    if (this.form.valid) {
      const value = this.utilesService.getDirtyValues(this.form);
      this.saveData.emit(value);
    }
  }

  private initForm() {
    this.form = this.fb.group({
      name: [this.offer ? this.offer.name : '', [Validators.required]],
      description: [this.offer ? this.offer.description : '', Validators.required],
      price: [this.offer ? this.offer.price : '', Validators.required]
    });
  }
}
