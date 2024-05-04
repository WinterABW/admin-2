import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStates,
  ApexStroke,
  ApexTheme,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ChartComponent,
  ChartType
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: any;
  stroke: ApexStroke;
  states: ApexStates;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  theme: ApexTheme;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent implements OnInit, OnChanges {
  @ViewChild(ChartComponent) chartComponent: ChartComponent;
  @Input() type: ChartType;
  @Input() series: any[];
  @Input() categories: string[];
  @Input() labels: string[];
  @Input() title: string;
  public chartOptions: Partial<ChartOptions> | undefined;


  constructor() {
  }

  ngOnInit(): void {
    this.buildCardsChart();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<any> {
    /* if (changes.categories) {
      // @ts-ignore
      this.chartOptions?.xaxis.categories = changes.categories.currentValue;
    }
    if (changes.series) {
      // @ts-ignore
      this.chartOptions?.series = changes.series.currentValue;
    }
    await this.chartComponent?.updateOptions(this.chartOptions, true, true, true);
 */
  }

  private buildCardsChart() {
    this.chartOptions = {
      series: this.series,
      tooltip: {
        theme: 'dark',
        fillSeriesColor: false
      },
      chart: {
        height: 250,
        type: this.type,
      },
      labels: this.labels || [],
      dataLabels: {
        enabled: false,
      },
      title: {
        text: this.title,
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          fontFamily: 'Fira Code, Arial',
          color: '#263238'
        }
      },
      xaxis: {
        categories: this.categories || []
      },
      theme: {
        mode: 'light',
        palette: 'palette6',
        monochrome: {
          enabled: false,
          color: '#255aee',
          shadeTo: 'light',
          shadeIntensity: 0.65
        },
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      legend: {
        show: true,
        position: 'bottom',
        fontSize: '14px',
        fontFamily: 'Fira Code, Arial',
        fontWeight: 800,
        formatter: (seriesName, opts) => {
          return [seriesName, ' - ', opts.w.globals.series[opts.seriesIndex]].join('');
        }
      },
    };
  }
}
