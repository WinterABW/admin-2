import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsSellerComponent } from './details-seller.component';

describe('DetailsSellerComponent', () => {
  let component: DetailsSellerComponent;
  let fixture: ComponentFixture<DetailsSellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsSellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
