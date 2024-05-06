import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { debounceTime, distinctUntilChanged, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { Series } from '@swimlane/ngx-charts';
import { addDays, format, Interval, intervalToDuration, parseISO, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { Publicacion } from '../../../../models/publicacion';
import { PictaResponse } from '../../../../models/response.picta.model';
import { Observable } from "rxjs";
import { CanalService } from "../../../../services/canal.service";
import { DateRange, ExtractDateTypeFromSelection, MatDatepickerInputEvent } from "@angular/material/datepicker";
import { formatDate } from '@angular/common';
import { PublicationService } from 'src/app/services/publication.service';
import { PaymentService } from 'src/app/services/payment.service';
import { Sale } from 'src/app/models/sale';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  // sales: Sale[];
  salesByReproduccion: Sale[];
  salesByDescarga: Sale[];
  salesFilters: UntypedFormGroup;
  // salesChartData: Series[];
  salesChartDataByReproduccion: Series[];
  salesChartDataByDescarga: Series[];
  salesAmountChartData: Series[];
  salesScheme = {
    domain: ['#5AA454', '#7aa3e5']
  };
  amountScheme = {
    domain: ['#7aa3e5']
  };
  // options
  legend: boolean = true;
  legendTitle: string = 'Leyenda';
  legendPosition: string = 'below';
  showLabels: boolean = true;
  animations: boolean = true;
  roundDomains: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Fecha';
  yAxisLabel: string = 'Ventas';
  timeline: boolean = true;
  autoScale: boolean = true;
  isSelected: boolean = false
  pubList: Publicacion[];
  pubsControl = new UntypedFormControl('');
  canales$: Observable<any[]>;
  private selectedPublication: Publicacion;

  constructor(
    private paymentService: PaymentService,
    private publicationService: PublicationService,
    private canalService: CanalService,
    public authService: AuthService,
    private fb: UntypedFormBuilder
  ) {
    this.canales$ = this.canalService.getA({ ordering: 'nombre', page_size: 100 }).pipe(
      map(list => [{ nombre: 'Ver todos' }, ...list]));
  }

  get salesCountByReproduccion(): number {
    return this.salesByReproduccion?.reduce((sum, currentValue) => sum + currentValue.sales, 0) || 0;
  }

  get salesCountByDescarga(): number {
    return this.salesByDescarga?.reduce((sum, currentValue) => sum + currentValue.sales, 0) || 0;
  }

  get etecsaPercentByReproduccion(): number {
    return parseFloat((this.generalAmountByReproduccion * 0.26).toFixed(2));
  }


  get etecsaPercentByDescarga(): number {
    return parseFloat((this.generalAmountByDescarga * 0.25).toFixed(2));
  }

  get disqueraPercentByReproduccion(): number {
    return parseFloat((this.generalAmountByReproduccion * 0.73).toFixed(2));
  }

  get disqueraPercentByDescarga(): number {
    return parseFloat((this.generalAmountByDescarga * 0.74).toFixed(2));
  }

  get bancoPercentByReproduccion(): number {
    return parseFloat((this.generalAmountByReproduccion * 0.01).toFixed(2));
  }

  get bancoPercentByDescarga(): number {
    return parseFloat((this.generalAmountByDescarga * 0.01).toFixed(2));
  }

  get generalAmountByReproduccion(): number {
    return Number(this.salesByReproduccion?.reduce((sum, currentValue) => sum + currentValue.amount, 0).toFixed(2)) || 0;
  }

  get generalAmountByDescarga(): number {
    return Number(this.salesByDescarga?.reduce((sum, currentValue) => sum + currentValue.amount, 0).toFixed(2)) || 0;
  }

  ngOnInit() {
    this.initParamsForm();
  }

  load() {
    const filters = this.getSalesFilters();
    const filtersDownload = JSON.parse(JSON.stringify(filters));
    const filtersReproduccion = JSON.parse(JSON.stringify(filters));
    if (this.selectedPublication) {
      filtersDownload.external_id = `publicacion_descarga_${this.selectedPublication?.id}`;
      filtersReproduccion.external_id = `publicacion_reproduccion_${this.selectedPublication?.id}`;

    } else {
      delete filtersDownload.external_id;
      delete filtersReproduccion.external_id;
      filtersReproduccion.external_id__contains = `publicacion_reproduccion`;
      filtersDownload.external_id__contains = `publicacion_descarga`;
    }
    
    this.paymentService.getSales(filtersDownload).pipe(
      tap((data: any) => {
        this.salesByDescarga = data;        
        this.salesChartDataByDescarga = this.getSalesByDescargaChart();
      })
    ).subscribe();

    this.paymentService.getSales(filtersReproduccion).pipe(
      tap((data: any) => {
        this.salesByReproduccion = data;
        this.salesChartDataByReproduccion = this.getSalesByReproduccionChart();
      })
    ).subscribe();

  }

  loadPublicaciones(term: string) {
    this.publicationService.getAll(term ? {
      nombre__wildcard: term + '*',
      precios__isnull: false
    } : { precios__isnull: false }).subscribe((pubs: any) => {
      this.pubList = pubs.results;
    });
  }

  selectPublication(publication: Publicacion) {
    this.isSelected = true;
    if (publication) {
      this.pubsControl.setValue(publication.nombre || '');
      this.selectedPublication = publication;
      this.salesFilters.patchValue({ external_id: `publicacion_${this.salesFilters.get('type_pub').value}_${publication?.id}` });
    } else {
      delete this.selectedPublication;
      this.pubsControl.setValue('');
      this.salesFilters.patchValue({ external_id: `` });
    }
  }

  searchPub($event: { term: string; items: any[] }) {
    const { term } = $event;
    this.pubsControl.setValue(term);
  }

  private initParamsForm() {
    const endDate = new Date();
    const startDate = subMonths(endDate, 1);
    this.salesFilters = this.fb.group({
      period: ['day'],
      // type_pub: ['reproduccion'],
      //type: ['payment'],
      date__gte: [startDate],
      date__lt: [endDate],
      //external_id: [''],
      channel_id: [''],
    });

    this.salesFilters.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      shareReplay()
    ).subscribe(value => {
      // this.loadSales();
      this.load();
    });

    this.pubsControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      shareReplay(),
      switchMap(value => value ? this.publicationService.getAll({
        nombre__wildcard: value + '*',
        precios__isnull: false
      }) : this.publicationService.getAll({ precios__isnull: false }))
    ).subscribe((response: PictaResponse<Publicacion>) => {
      this.pubList = response.results;
    });
    this.load();
  }

  private getSalesByReproduccionChart(): Series[] {
    const { period } = this.salesFilters.value;
    return [
      {
        series: this.salesByReproduccion?.map(sale => ({
          name: period === 'day' ? format(parseISO(sale.day), 'dd/MM/yyyy') : format(parseISO(sale.day), 'MMMM', { locale: es }),
          //name: sale.day,
          value: sale.sales
        })),
        name: 'Ventas'
      },
      {
        series: this.salesByReproduccion?.map(amount => ({
          name: period === 'day' ? format(parseISO(amount.day), 'dd/MM/yyyy') : format(parseISO(amount.day), 'MMMM', { locale: es }),
          //name: sale.day,
          value: amount.amount
        })),
        name: 'Ingreso'
      }
    ];
  }

  private getSalesByDescargaChart(): Series[] {
    const { period } = this.salesFilters.value;
    return [
      {
        name: 'Ventas',
        series: this.salesByDescarga?.map(sale => ({
          name: period === 'day' ? format(parseISO(sale.day), 'dd-mm-yyyy') : format(parseISO(sale.day), 'MMMM', { locale: es }),
          //name: sale.day,
          value: sale.sales
        }))
      },
      {
        name: 'Ingreso',
        series: this.salesByDescarga?.map(amount => ({
          name: period === 'day' ? format(parseISO(amount.day), 'dd-mm-yyyy') : format(parseISO(amount.day), 'MMMM', { locale: es }),
          //name: sale.day,
          value: amount.amount
        }))
      }
    ];
  }

  private getSalesFilters() {
    const filters = this.salesFilters.value;
    if (!filters.channel_id) {
      delete filters.channel_id;
    }
    if (filters.date__gte) {
      try {
        filters.date__gte = format(parseISO(formatDate(filters.date__gte, "yyyy-MM-dd", 'en-GB')), 'yyyy-MM-dd');
      } catch (e) {
        console.log(e)
      }
    } else {
      delete filters.date__gte;
    }
    if (filters.date__lt) {
      try {
        filters.date__lt = format(addDays(parseISO(formatDate(filters.date__lt, "yyyy-MM-dd", 'en-GB')), 1), 'yyyy-MM-dd');
      } catch (e) {
        console.log(e)
      }
    } else {
      delete filters.date__lt;
    }
    /*if (filters.type === 'all') {
        delete filters.type;
      }*/
    return filters;
  }

  startDateChanged({ value }: MatDatepickerInputEvent<ExtractDateTypeFromSelection<DateRange<Date>>, DateRange<Date>>) {
    const interval: Interval = {
      start: value,
      end: Date.now()
    };
    const duration = intervalToDuration(interval);
    this.salesFilters.patchValue({
      period: duration.months > 2 ? 'month' : 'day'
    });
  }

  endDateChanged({ value: end }: MatDatepickerInputEvent<ExtractDateTypeFromSelection<DateRange<Date>>, DateRange<Date>>) {
    if (end) {
      const start = this.salesFilters.get('date__gte').value;
      const interval: Interval = {
        start,
        end
      };
      const duration = intervalToDuration(interval);
      this.salesFilters.patchValue({
        period: duration.months >= 2 ? 'month' : 'day'
      });
    }

  }

  exportTable() {
    const filters = this.salesFilters.value;

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

    /*
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
         filters.item_external_id = `publicacion_${this.pubsControl.get('type_pub').value}_${this.selectedPublication?.id}`;
   
       } else {
         delete filters.external_id;
         filters.external_id__contains = `publicacion_${this.pubsControl.get('type_pub').value}`;
       } */

    this.paymentService.exportExcel_ventas(filters).subscribe((response: any) => {
      const dataType = response.type;
      const binaryData = [];
      binaryData.push(response);
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType.toString() }));
      downloadLink.setAttribute('download', `Picta - Reporte de Ventas (${format(new Date(), 'dd-MM-yyyy')}).xlsx`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });

  }
}
