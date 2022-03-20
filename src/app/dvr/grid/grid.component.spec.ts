import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridUpcomingComponent } from './grid.component';

describe('GridComponent', () => {
  let component: GridUpcomingComponent;
  let fixture: ComponentFixture<GridUpcomingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridUpcomingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridUpcomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
