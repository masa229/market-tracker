import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { WatchlistService } from '../services/watchlist.service';
import { StockService } from '../services/stock.service';
import { CommentService } from '../services/comment.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    const watchlistServiceSpy = jasmine.createSpyObj<WatchlistService>('WatchlistService', [
      'getAllWatchlists',
      'addStockToWatchlist',
      'removeStockFromWatchlist'
    ]);
    const stockServiceSpy = jasmine.createSpyObj<StockService>('StockService', ['getPriceHistory']);
    const commentServiceSpy = jasmine.createSpyObj<CommentService>('CommentService', [
      'getCommentsByStockId',
      'createComment',
      'updateComment',
      'deleteComment'
    ]);

    watchlistServiceSpy.getAllWatchlists.and.returnValue(of([]));
    watchlistServiceSpy.addStockToWatchlist.and.returnValue(of({ id: 1, tickerSymbol: 'MSFT' }));
    watchlistServiceSpy.removeStockFromWatchlist.and.returnValue(of(void 0));
    stockServiceSpy.getPriceHistory.and.returnValue(of({ tickerSymbol: 'MSFT', range: '1M', prices: [] }));
    commentServiceSpy.getCommentsByStockId.and.returnValue(of([]));
    commentServiceSpy.createComment.and.returnValue(of({
      id: 1,
      content: 'Comment',
      creationDate: new Date().toISOString(),
      lastEditedDate: new Date().toISOString()
    }));
    commentServiceSpy.updateComment.and.returnValue(of({
      id: 1,
      content: 'Updated comment',
      creationDate: new Date().toISOString(),
      lastEditedDate: new Date().toISOString()
    }));
    commentServiceSpy.deleteComment.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: WatchlistService, useValue: watchlistServiceSpy },
        { provide: StockService, useValue: stockServiceSpy },
        { provide: CommentService, useValue: commentServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
