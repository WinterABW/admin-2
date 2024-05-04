import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  @Input() title: string;
  @Input() showAddBtn = true;
  @Input() showRefreshBtn = true;
  @Output() addClicked = new EventEmitter();
  @Output() refreshClicked = new EventEmitter();
  @Input() addUrl: string;
  @Input() addPermission: string;

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  addBtnClicked() {
    this.addClicked.emit();
    if (this.addUrl) {
      this.navigateTo(this.addUrl);

    }
  }

  refreshBtnClicked() {
    this.refreshClicked.emit();
  }

  private async navigateTo(url: string): Promise<void> {
    await this.router.navigateByUrl(url);
  }
}
