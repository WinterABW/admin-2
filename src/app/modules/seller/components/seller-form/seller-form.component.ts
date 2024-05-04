import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { catchError, finalize, map, startWith, tap } from 'rxjs/operators';

import { SellerService } from "../../../../services/seller.service";
import { HotToastService } from "@ngneat/hot-toast";
import { Router } from "@angular/router";
import { Seller } from 'src/app/models/payment';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-seller-form',
  templateUrl: './seller-form.component.html',
  styleUrls: ['./seller-form.component.scss']
})
export class SellerFormComponent implements OnInit {
  @Input() seller: Seller;
  form: UntypedFormGroup;
  @Output() saveData = new EventEmitter();
  provinces$: Observable<any[]>;
  municipalities$: Observable<any[]>;
  loadingProvinces = true;
  loadingMunicipalities = false;
  aceptada = false;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private locationService: LocationService,
    private toastService: HotToastService,
    private sellerService: SellerService
  ) {
    this.provinces$ = this.locationService.getProvinces().pipe(
      map(response => response.results),
      finalize(() => this.loadingProvinces = false)
    );
  }

  ngOnInit(): void {
    this.initForm();
  }

  get type() {
    return this.form?.get('type')?.value;
  }

  selectProvince($event: any) {
    this.form.get('municipality').reset();
    if ($event) {
      this.loadingMunicipalities = true;
      this.municipalities$ = this.locationService.getMunicipalities({ province__id: $event.id }).pipe(
        map(response => {
          this.form.get('municipality').enable();
          return response.results;
        }),
        catchError(err => {
          this.form.get('municipality').disable();

          throw err;
        }),
        finalize(() => this.loadingMunicipalities = false)
      );

    } else {
      this.form.get('municipality').disable();

    }
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const seller = this.form.value;
    if (this.type === 'LEGAL') {
      delete seller.ci;
    } else {
      delete seller.reuup;
    }
    delete seller.province;
    this.sellerService.update(seller, seller.id)
      .pipe(
        this.toastService.observe({
          loading: 'Actualizando vendedor',
          success: 'Vendedor actualizado correctamente',
          error: (error) => {
            console.log(error);
            return 'Error al actualizar el vendedor';
          }
        })
      )
      .subscribe(() => this.router.navigate(['/seller']));
  }

  private initForm() {
    this.form = this.fb.group({
      id: [''],
      ci: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern('^\\d+$')]],
      type: ['NATURAL', [Validators.required]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required]],
      province: [null, [Validators.required]],
      reuup: ['', [Validators.required]],
      bank_branch: ['', [Validators.required]],
      bank_card: ['', [Validators.required]],
      type_plattform: ['picta', [Validators.required]],
      nit: ['', [Validators.required]],
      license: ['', [Validators.required]],
      provider_streaming: ['', [Validators.required, Validators.pattern('^\\d+$')]],
      provider_download: ['', [Validators.required, Validators.pattern('^\\d+$')]],
      account: ['', [Validators.pattern('^\\d+$'), Validators.minLength(16), Validators.maxLength(16)]],
      municipality: [{ value: null, disabled: true }, [Validators.required]],
      // user: ['', []],
    });

    this.form.get('type').valueChanges
      .pipe(
        startWith(this.seller?.type || 'NATURAL'),
        tap(type => {
          if (type === 'NATURAL') {
            this.enableControls(['license', 'nit', 'ci']);
            this.disableControls(['reuup']);
          } else {
            this.enableControls(['reuup']);
            this.disableControls(['license', 'nit', 'ci']);
          }
        })
      )
      .subscribe();

    if (this.seller) {
      this.form.patchValue(this.seller);
      this.loadingMunicipalities = true;
      this.locationService.getMunicipalities({ name: this.seller.municipality })
        .subscribe(response => {
          const municipality = response.results[0];
          this.form.get('municipality').setValue(municipality.id);
          this.form.get('municipality').enable();
          this.provinces$.subscribe(provinces => {
            const province = provinces.find(prov => prov.name === response.results[0].province);
            this.form.get('province').setValue(province.id);
            this.municipalities$ = this.locationService.getMunicipalities({ province__id: province.id })
              .pipe(map(res => res.results), finalize(() => this.loadingMunicipalities = false));
          });
        });
    }

  }

  private enableControls(controlKeys: string[]) {
    controlKeys.forEach(key => {
      this.form.controls[key].enable();
    });
  }

  private disableControls(controlKeys: string[]) {
    controlKeys.forEach(key => {
      this.form.controls[key].disable();
    });
  }

  mayorDeEdad(): ValidationErrors | null {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value.length === 11) {
        const ci = control.value;
        let y = Number(ci.substring(0, 2));
        const m = Number(ci.substring(2, 4));
        const d = Number(ci.substring(4, 6));
        const c = Number(ci[6]);
        if (c >= 0 && c <= 5) {
          y = 1900 + y;
        } else if (c >= 6 && c <= 8) {
          y = 2000 + y;
        } else {
          y = 1800 + y;
        }
        const currYear = Number(new Date().getFullYear().toString());
        const currMonth = Number(new Date().getMonth().toString()) + 1;
        const currDay = Number(new Date().getDate().toString());
        let age = currYear - y;
        if (currMonth < m) {
          age -= 1;

        } else if (currMonth === m) {
          if (currDay < d) {
            age -= 1;
          }
        }
        if (age < 18) {
          return { underage: true };

        }
      }
      return control.errors;
    };
  }
}
