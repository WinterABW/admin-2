import {Component, OnInit, ViewChild} from '@angular/core';
import {GeneroTableComponent} from '../genero-table/genero-table.component';
import {debounceTime, shareReplay} from 'rxjs/operators';
import {UntypedFormControl} from '@angular/forms';

@Component({
  selector: 'app-genero-list',
  templateUrl: './genero-list.component.html',
  styleUrls: ['./genero-list.component.scss']
})
export class GeneroListComponent implements OnInit {
  @ViewChild(GeneroTableComponent) tableComponent: GeneroTableComponent;
  filterControl = new UntypedFormControl('');

  constructor() {
  }

  ngOnInit(): void {
    this.listenFilterControl();

  }

  refresh() {

  }

  private listenFilterControl() {
    this.filterControl.valueChanges.pipe(
      debounceTime(400),
      shareReplay()
    ).subscribe(value => {
      this.tableComponent.loadData({nombre__wildcard: `*${value}*`});
    });
  }
}
