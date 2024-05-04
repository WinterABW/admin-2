import {DataSource} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Observable, Subject} from 'rxjs';
import {GeneroService} from '../../../../services/genero.service';
import {Directive, ViewChild} from '@angular/core';
import {PictaResponse} from '../../../../models/response.picta.model';
import {finalize} from 'rxjs/operators';

// TODO: Replace this with your own data model type
export interface GeneroTableItem {
  nombre: string;
  tipo: string;
  id: number;
}
/**
 * Data source for the GeneroTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
@Directive()
export class GeneroTableDataSource extends DataSource<GeneroTableItem> {
  data: GeneroTableItem[] = [];
  @ViewChild('paginator') paginator: MatPaginator;
  sort: MatSort;
  subjectData = new Subject<GeneroTableItem[]>();
  filters = {
    page: 1,
    page_size: 10,
  };
  loading = true;

  constructor(private generoService: GeneroService) {
    super();
    this.loadData();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<GeneroTableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    return this.subjectData.asObservable();

  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {
    this.subjectData.complete();

  }

  public loadData(params = {}) {
    this.loading = true;
    if (params) {
      this.filters = {...this.filters, ...params};
    }
    this.generoService.getList(this.filters)
      .pipe(finalize(() => this.loading = false))
      .subscribe((response: PictaResponse<GeneroTableItem>) => {
        this.data = response.results;
        this.paginator.length = response.count;
        this.subjectData.next(this.data);
      });
  }

  public listenPaginate() {
    this.paginator.page.subscribe(data => {
      this.filters.page = data.pageIndex + 1;
      this.filters.page_size = data.pageSize;
      this.loadData();
    });
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: GeneroTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  /*
    private getSortedData(data: GeneroTableItem[]) {
      if (!this.sort.active || this.sort.direction === '') {
        return data;
      }

      return data.sort((a, b) => {
        const isAsc = this.sort.direction === 'asc';
        switch (this.sort.active) {
          case 'name':
            return compare(a.name, b.name, isAsc);
          case 'id':
            return compare(+a.id, +b.id, isAsc);
          default:
            return 0;
        }
      });
    }
  */
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
