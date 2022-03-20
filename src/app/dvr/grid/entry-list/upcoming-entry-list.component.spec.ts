import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingEntryListComponent } from './upcoming-entry-list.component';

describe('UpcomingEntryListComponent', () => {
  let component: UpcomingEntryListComponent;
  let fixture: ComponentFixture<UpcomingEntryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingEntryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
