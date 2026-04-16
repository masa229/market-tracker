export interface CommentDto {
  id: number;
  content: string;
  creationDate: string;
  lastEditedDate: string;
}

export interface CreateCommentDto {
  content: string;
  stockId: number;
}

export interface UpdateCommentDto {
  content: string;
}
