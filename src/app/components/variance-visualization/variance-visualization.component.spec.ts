import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarianceVisualizationComponent } from './variance-visualization.component';

describe('VarianceVisualizationComponent', () => {
  let component: VarianceVisualizationComponent;
  let fixture: ComponentFixture<VarianceVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarianceVisualizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VarianceVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
