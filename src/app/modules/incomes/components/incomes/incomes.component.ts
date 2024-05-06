import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, finalize, map, shareReplay, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Publicacion } from '../../../../models/publicacion';
import { addDays, subMonths } from 'date-fns';
import { format } from 'date-fns/format';
import { CanalService } from "../../../../services/canal.service";
import { AuthService } from 'src/app/services/auth.service';
import { Payment, Seller } from 'src/app/models/payment';
import { PublicationService } from 'src/app/services/publication.service';
import { PaymentService } from 'src/app/services/payment.service';
import { SellerService } from 'src/app/services/seller.service';

@Component({
  selector: 'app-incomes',
  templateUrl: './incomes.component.html',
  styleUrls: ['./incomes.component.scss']
})
export class IncomesComponent implements OnInit {
  user: any;
  isLoggin = true;
  isAuth = true;
  isMobile: boolean;

  sellers$: Observable<Seller[]>;

  payments: Payment[];

  // displayedColumns: string[] = ['date', 'publicacion', 'type', 'seller', 'buyer', 'state', 'phone', 'bank_id', 'id', 'amount'];
  displayedColumns: string[] = ['date', 'publicacion', 'type', 'seller', 'state', 'amount'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  loadingSellers = true;
  loadingPubs = true;
  sellerForm: UntypedFormGroup;
  selectedSeller: Seller;
  total: any;
  params = {
    limit: 10,
    offset: 0,
    seller_ci: ''
  };
  pubList: Observable<Publicacion[]>;
  paymentFilters: UntypedFormGroup;
  pubControl = new UntypedFormControl('');
  canales$: Observable<any[]>;
  event: Publicacion;


  constructor(
    private paymentService: PaymentService,
    private sellerService: SellerService,
    private publicationService: PublicationService,
    private canalService: CanalService,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    public authService: AuthService,
  ) {
    this.canales$ = this.canalService.getA({ ordering: 'nombre', page_size: 100 });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((res: any) => {
      if (res) {
        this.user = res;
        this.isLoggin = this.authService.isLoggedIn();
      } else {
        this.authService.getUserData().subscribe(
          (response: any) => {
            this.authService.setUserData(response);
          }
        );
      }
    });

    this.createForm();
    this.load();
  }

  load() {
    this.loadPublicaciones('');
    this.loadSellers();
    this.loadPayments();

  }

  selectSeller(seller: Seller) {
    if (seller) {
      this.selectedSeller = seller;
      this.sellerForm.patchValue({
        type__iexact: seller.type,
        name__icontains: seller.name,
        ci__icontains: seller.ci,
      }, { emitEvent: false });
      this.paymentFilters.patchValue({
        seller_ci: seller.ci
      });

    } else {
      delete this.selectedSeller;
      this.sellerForm.reset();
      this.paymentFilters.patchValue({
        seller_ci: undefined
      });
    }
    // this.loadPayments();
  }

  paginate({ pageIndex, pageSize, length }: PageEvent) {
    this.paymentFilters.patchValue({
      offset: pageIndex * pageSize,
      limit: pageSize,
    });
    this.total = length;
  }

  searchSeller($event: { term: string; items: any[] }) {
    const { term } = $event;
    this.sellerForm.patchValue({
      name__icontains: term
    });
  }

  private selectedPublication: Publicacion;

  loadPublicaciones(term: string) {
    this.loadingPubs = true;
    this.pubList = this.publicationService.getAll(term ? {
      nombre__wildcard: term + '*',
      precios__isnull: false
    } : { precios__isnull: false }).pipe(
      map((response: any) => response.results),
      finalize(() => this.loadingPubs = false)
    );
  }

  selectPublication(publication: Publicacion) {
    if (publication) {
      this.selectedPublication = publication;
      this.paymentFilters.patchValue({ item_external_id: `publicacion_${this.paymentFilters.get('type_pub').value}_${publication?.id}` });
    } else {
      delete this.selectedPublication;
      this.paymentFilters.patchValue({ external_id: `` });
    }
  }

  searchSellerByCI($event: { term: string; items: any[] }) {
    const { term } = $event;
    this.sellerForm.patchValue({
      ci__icontains: term
    });
  }

  export() {
    this.snackBar.open('Por implementar');

  }

  exportTable() {
    const filters = this.paymentFilters.value;

    if (filters.date__gte) {
      try {
        filters.date__gte = format(filters.date__gte, 'yyyy-MM-dd');
      } catch (e) {
        console.log(e)
      }
    } else {
      delete filters.date__gte;
    }

    if (filters.date__lt) {
      try {
        filters.date__lt = format(addDays(filters.date__lt, 1), 'yyyy-MM-dd');
      } catch (e) {
        console.log(e)
      }
    } else {
      delete filters.date__lt;
    }

    if (!filters.item_external_id) {
      delete filters.item_external_id;
    }

    if (filters.type === 'all') {
      delete filters.type;
    }

    if (!filters.channel_id) {
      delete filters.channel_id;
    }

    if (this.selectedPublication) {
      filters.item_external_id = `publicacion_${this.paymentFilters.get('type_pub').value}_${this.selectedPublication?.id}`;

    } else {
      delete filters.external_id;
      //filters.external_id__contains = `publicacion_${this.paymentFilters.get('type_pub').value}`;
    }

    if (!filters.state) delete filters.state;
    // delete filters.type;
    delete filters.seller_ci;
    delete filters.limit;
    delete filters.offset;
    delete filters.type_pub;

    const sellerFilters = this.sellerForm.value;

    if (sellerFilters.type__iexact) {
      filters.seller__contains = JSON.stringify({ type: sellerFilters.type__iexact });
    }
    if (sellerFilters.ci__icontains) {
      filters.seller__contains = JSON.stringify({ ci: sellerFilters.ci__icontains });
    }

    this.paymentService.exportExcel(filters).subscribe((response: any) => {
      const dataType = response.type;
      const binaryData = [];
      binaryData.push(response);
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType.toString() }));
      downloadLink.setAttribute('download', `Picta - Reporte de Pagos (${format(new Date(), 'dd-MM-yyyy')}).xlsx`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });

  }

  private loadSellers() {
    this.loadingSellers = true;
    const sellerFilters = this.sellerForm.value;

    !sellerFilters.name__icontains && delete sellerFilters.name__icontains;
    !sellerFilters.ci__icontains && delete sellerFilters.ci__icontains;
    !sellerFilters.type__iexact && delete sellerFilters.type__iexact;
    this.sellers$ = this.sellerService.getAll(sellerFilters)
      .pipe(
        map(response => response.results),
        finalize(() => this.loadingSellers = false),
        shareReplay()
      );
  }

  private loadPayments() {
    const filters = this.paymentFilters.value;
    if (filters.date__gte) {
      filters.date__gte = format(filters.date__gte, 'yyyy-MM-dd');
    } else {
      delete filters.date__gte;
    }
    if (filters.date__lt) {
      filters.date__lt = format(addDays(filters.date__lt, 1), 'yyyy-MM-dd');
    } else {
      delete filters.date__lt;
    }
    if (!filters.item_external_id) {
      delete filters.item_external_id;
    }
    if (filters.type === 'all') {
      delete filters.type;
    }
    if (!filters.seller_ci) {
      delete filters.seller_ci;
    }
    if (!filters.channel_id) {
      delete filters.channel_id;
    }
    if (this.selectedPublication) {
      filters.item_external_id = `publicacion_${this.paymentFilters.get('type_pub').value}_${this.selectedPublication?.id}`;
    } else {
      delete filters.external_id;
      //filters.external_id__contains = `publicacion_${this.paymentFilters.get('type_pub').value}`;
    }
    if (!filters.state) delete filters.state;

    delete filters.type_pub;
    this.paymentService.getPayments(filters).pipe(
      tap((data: any) => {
        this.payments = data.results;
        this.total = data.count;
      }),
    ).subscribe();
  }

  private createForm() {
    const endDate = new Date();
    const startDate = subMonths(endDate, 1);
    this.sellerForm = this.fb.group({
      type__iexact: [''],
      name__icontains: [''],
      ci__icontains: [''],
    });
    this.sellerForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      shareReplay()
    ).subscribe(value => {
      this.loadSellers();
    });
    this.paymentFilters = this.fb.group({
      date__gte: [startDate],
      date__lt: [endDate],
      item_external_id: [],
      limit: [10],
      offset: [0],
      seller_ci: [],
      state: ['SUCCESS'],
      type_pub: ['reproduccion'],
      type: ['all'],
      channel_id: [''],
    });
    this.paymentFilters.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      shareReplay()
    ).subscribe(value => {
      this.loadPayments();
    });
    this.pubControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      shareReplay(),
      tap(x => {
        this.loadPublicaciones(x);
      })
    );
  }

  get permissions() {
    return this.user.groups.filter(group => group.name !== 'Usuario común').reduce((accumulator, currentValue) => accumulator.concat(currentValue.permissions), []);
  }

  public hasPermission(permission: string) {
    return this.permissions.findIndex(permiso => permiso.codename === permission) >= 0;
  }

  public isAdmin() {
    return this.user.groups.some(g => g.name === 'Administrador');
  }
}
