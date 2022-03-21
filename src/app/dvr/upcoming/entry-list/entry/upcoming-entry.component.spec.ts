import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DvrUpcomingEntryComponent } from './upcoming-entry.component';

describe('DvrUpcomingEntryComponent', () => {
  let component: DvrUpcomingEntryComponent;
  let fixture: ComponentFixture<DvrUpcomingEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DvrUpcomingEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DvrUpcomingEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
