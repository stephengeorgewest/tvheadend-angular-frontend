import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListManagmentComponent } from './list-managment.component';

describe('ListManagmentComponent', () => {
  let component: ListManagmentComponent;
  let fixture: ComponentFixture<ListManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListManagmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
