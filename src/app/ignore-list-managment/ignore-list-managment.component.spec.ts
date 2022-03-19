import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IgnoreListManagmentComponent } from './ignore-list-managment.component';

describe('IgnoreListManagmentComponent', () => {
  let component: IgnoreListManagmentComponent;
  let fixture: ComponentFixture<IgnoreListManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IgnoreListManagmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IgnoreListManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
