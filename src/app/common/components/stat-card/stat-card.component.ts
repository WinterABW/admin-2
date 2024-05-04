import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent implements OnInit {
  @Input() color = 'blue';
  @Input() label = 'Total';
  @Input() number = 2222;
  @Input() decimal = 0;
  @Input() icon = '';
  options = {
    decimalPlaces: this.decimal
  };

  constructor() {
  }

  ngOnInit(): void {
    this.options.decimalPlaces = this.decimal;
  }

}
