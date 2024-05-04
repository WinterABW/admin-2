import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ApiNotificationEditComponent} from './api-notification-edit.component';

describe('ApiNotificationEditComponent', () => {
  let component: ApiNotificationEditComponent;
  let fixture: ComponentFixture<ApiNotificationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApiNotificationEditComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiNotificationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
