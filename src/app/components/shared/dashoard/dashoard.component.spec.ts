import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashoardComponent } from './dashoard.component';

describe('DashoardComponent', () => {
  let component: DashoardComponent;
  let fixture: ComponentFixture<DashoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
