import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from "@angular/material/tabs";
import { CompletePercentPipe } from 'src/app/complete-percent.pipe';

import { TitleListComponent } from './title-list.component';

describe('TitleListComponent', () => {
  let component: TitleListComponent;
  let fixture: ComponentFixture<TitleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
			imports: [MatTabsModule, MatIconModule, MatButtonModule, MatMenuModule],
			declarations: [TitleListComponent, CompletePercentPipe]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
