import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleServerStatusComponent } from './handle-server-status.component';

describe('HandleServerStatusComponent', () => {
  let component: HandleServerStatusComponent;
  let fixture: ComponentFixture<HandleServerStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandleServerStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandleServerStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
