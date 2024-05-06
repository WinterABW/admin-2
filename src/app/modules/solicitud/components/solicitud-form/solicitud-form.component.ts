import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { catchError, finalize, map, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-solicitud-form',
  templateUrl: './solicitud-form.component.html',
  styleUrls: ['./solicitud-form.component.scss']
})
export class SolicitudFormComponent implements OnInit {
  @Input() operacion: 'ADD' | 'EDIT' = 'ADD';
  @Input() solicitud: any;
  form: UntypedFormGroup;
  @Output() saveData = new EventEmitter();
  provinces$: Observable<any[]>;
  municipalities$: Observable<any[]>;
  loadingProvinces = true;
  loadingMunicipalities = false;
  aceptada = false;
  aceptadaControl = new UntypedFormControl('pendiente');

  constructor(
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private locationService: LocationService
  ) {
    this.provinces$ = this.locationService.getProvinces().pipe(
      map(response => response.results),
      finalize(() => this.loadingProvinces = false)
    );
    /*this.municipalities$ = this.locationService.getMunicipalities({limit: 200}).pipe(
      map(response => response.results),
      finalize(() => this.loadingMunicipalities = false)
    );*/
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
    const solicitud = this.form.value;
    if (this.type === 'LEGAL') {

    } else {
      delete solicitud.reuup;
    }
    delete solicitud.province;
    this.saveData.emit({ solicitud, estado: this.aceptadaControl.value });
  }

  private initForm() {
    this.form = this.fb.group({
      ci: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern('^\\d+$'), this.mayorDeEdad()]],
      type: ['NATURAL', [Validators.required]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required]],
      province: [null, [Validators.required]],
      reuup: ['', [Validators.required]],
      bank_branch: ['', [Validators.required]],
      bank_card: ['', [Validators.required]],
      type_plattform: ['picta', [Validators.required]],
      nit: ['', []],
      license: ['', []],
      provider_streaming: ['', [Validators.pattern('^\\d+$')]],
      provider_download: ['', [Validators.pattern('^\\d+$')]],
      account: ['', [Validators.pattern('^\\d+$'), Validators.minLength(16), Validators.maxLength(16)]],
      municipality: [{
        value: null,
        disabled: true
      }, [Validators.required]],
      user: ['', []],
    });
    this.form.get('provider_streaming').valueChanges.subscribe(value => {
      if (!value) {
        this.aceptadaControl.setValue('pendiente');
      }
    });
    this.form.get('provider_download').valueChanges.subscribe(value => {
      if (!value) {
        this.aceptadaControl.setValue('pendiente');
      }
    });
    this.form.get('type').valueChanges
      .pipe(
        startWith(this.solicitud?.type || 'NATURAL'),
        tap(type => {
          if (type === 'NATURAL') {
            this.enableControls([
              'ci',
              'license',
              'nit',
            ]);
            this.disableControls([
              'reuup',
            ]);
          } else {
            this.enableControls(['reuup']);
            this.disableControls([
              'license',
              'nit',
            ]);
          }
        })
      )
      .subscribe();
    if (this.solicitud) {
      this.aceptadaControl.setValue(this.solicitud.estado);
      this.form.patchValue(this.solicitud.data);
      this.loadingMunicipalities = true;
      this.locationService.getMunicipalities({ id: this.solicitud.data.municipality })
        .subscribe(response => {
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

      return null;
    };
  }
}
