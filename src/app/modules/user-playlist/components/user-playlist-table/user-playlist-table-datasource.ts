import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, Subject } from 'rxjs';
import { UserPlaylist } from '../../models/user-playlist';
import { UserPlaylistService } from '../../services/user-playlist.service';
import { PictaResponse } from '../../../../models/response.picta.model';
import { Directive, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';


/**
 * Data source for the UserPlaylistTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
@Directive()
export class UserPlaylistTableDataSource extends DataSource<UserPlaylist> {
  data: UserPlaylist[] = [];
  @ViewChild('paginator') paginator: MatPaginator;
  sort: MatSort;
  subjectData = new Subject<UserPlaylist[]>();
  filters = {
    page: 1,
    page_size: 10,
  };
  loading = true;

  constructor(private userPlaylistService: UserPlaylistService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<UserPlaylist[]> {
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

  public loadPlaylists() {
    this.loading = true;
    this.userPlaylistService.getAll(this.filters)
      .pipe(finalize(() => this.loading = false))
      .subscribe((response: PictaResponse<UserPlaylist>) => {
        this.data = response.results;
        this.paginator.length = response.count;
        this.subjectData.next(this.data);
      });
  }

  public listenPaginate() {
    this.paginator.page.subscribe(data => {
      this.filters.page = data.pageIndex + 1;
      this.filters.page_size = data.pageSize;
      this.loadPlaylists();
    });
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: UserPlaylist[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: UserPlaylist[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name':
          return compare(a.nombre, b.nombre, isAsc);
        case 'id':
          return compare(+a.id, +b.id, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
