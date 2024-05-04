import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerBottomsheetComponent } from './seller-bottomsheet.component';

describe('SellerBottomsheetComponent', () => {
  let component: SellerBottomsheetComponent;
  let fixture: ComponentFixture<SellerBottomsheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerBottomsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerBottomsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
