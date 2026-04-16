import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CommentDto,
  CreateCommentDto,
  UpdateCommentDto
} from '../models/comment.models';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/comments`;

  getCommentsByStockId(stockId: number): Observable<CommentDto[]> {
    return this.http.get<CommentDto[]>(`${this.baseUrl}/stock/${stockId}`);
  }

  createComment(dto: CreateCommentDto): Observable<CommentDto> {
    return this.http.post<CommentDto>(this.baseUrl, dto);
  }

  updateComment(id: number, dto: UpdateCommentDto): Observable<CommentDto> {
    return this.http.patch<CommentDto>(`${this.baseUrl}/${id}`, dto);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
