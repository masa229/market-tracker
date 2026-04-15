import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockDetailPanelComponent } from './stock-detail-panel-component';

describe('StockDetailPanelComponent', () => {
  let component: StockDetailPanelComponent;
  let fixture: ComponentFixture<StockDetailPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockDetailPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
