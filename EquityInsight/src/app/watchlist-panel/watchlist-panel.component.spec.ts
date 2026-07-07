import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { WatchlistPanelComponent } from './watchlist-panel.component';
import { WatchlistService } from '../services/watchlist.service';

describe('WatchlistPanelComponent', () => {
  let component: WatchlistPanelComponent;
  let fixture: ComponentFixture<WatchlistPanelComponent>;
  let watchlistServiceSpy: jasmine.SpyObj<WatchlistService>;

  beforeEach(async () => {
    watchlistServiceSpy = jasmine.createSpyObj<WatchlistService>('WatchlistService', [
      'getAllWatchlists',
      'createWatchlist',
      'updateWatchlistTitle',
      'deleteWatchlist',
      'removeStockFromWatchlist'
    ]);
    watchlistServiceSpy.getAllWatchlists.and.returnValue(of([]));
    watchlistServiceSpy.createWatchlist.and.returnValue(of({ id: 1, title: 'New list', stocks: [] }));
    watchlistServiceSpy.updateWatchlistTitle.and.returnValue(of({ id: 1, title: 'Updated list', stocks: [] }));
    watchlistServiceSpy.deleteWatchlist.and.returnValue(of(void 0));
    watchlistServiceSpy.removeStockFromWatchlist.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [WatchlistPanelComponent],
      providers: [{ provide: WatchlistService, useValue: watchlistServiceSpy }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchlistPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
