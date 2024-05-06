import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsCanalComponent} from './details-canal.component';

describe('DetailsCanalComponent', () => {
  let component: DetailsCanalComponent;
  let fixture: ComponentFixture<DetailsCanalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsCanalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsCanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
