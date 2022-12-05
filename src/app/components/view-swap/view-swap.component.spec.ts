import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSwapComponent } from './view-swap.component';

describe('ViewSwapComponent', () => {
  let component: ViewSwapComponent;
  let fixture: ComponentFixture<ViewSwapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSwapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
