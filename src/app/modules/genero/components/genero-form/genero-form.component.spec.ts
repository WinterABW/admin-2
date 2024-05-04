import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneroFormComponent } from './genero-form.component';

describe('GeneroFormComponent', () => {
  let component: GeneroFormComponent;
  let fixture: ComponentFixture<GeneroFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneroFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
