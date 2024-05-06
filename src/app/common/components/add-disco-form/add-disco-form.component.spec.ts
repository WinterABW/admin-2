import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddDiscoFormComponent} from './add-disco-form.component';

describe('AddDiscoFormComponent', () => {
  let component: AddDiscoFormComponent;
  let fixture: ComponentFixture<AddDiscoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDiscoFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiscoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
