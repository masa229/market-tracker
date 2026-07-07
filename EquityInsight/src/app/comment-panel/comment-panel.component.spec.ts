import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CommentPanelComponent } from './comment-panel.component';
import { CommentService } from '../services/comment.service';

describe('CommentPanelComponent', () => {
  let component: CommentPanelComponent;
  let fixture: ComponentFixture<CommentPanelComponent>;
  let commentServiceSpy: jasmine.SpyObj<CommentService>;

  beforeEach(async () => {
    commentServiceSpy = jasmine.createSpyObj<CommentService>('CommentService', [
      'getCommentsByStockId',
      'createComment',
      'updateComment',
      'deleteComment'
    ]);
    commentServiceSpy.getCommentsByStockId.and.returnValue(of([]));
    commentServiceSpy.createComment.and.returnValue(of({
      id: 1,
      content: 'Test comment',
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
      imports: [CommentPanelComponent],
      providers: [{ provide: CommentService, useValue: commentServiceSpy }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
