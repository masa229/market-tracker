package app.equityinsight.comment;

import app.equityinsight.comment.dto.CommentDto;
import app.equityinsight.comment.dto.CreateCommentDto;
import app.equityinsight.comment.dto.UpdateCommentDto;
import app.equityinsight.exception.CommentNotFoundException;
import app.equityinsight.exception.StockNotFoundException;
import app.equityinsight.stock.Stock;
import app.equityinsight.stock.StockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final StockRepository stockRepository;

    public CommentService(
            CommentRepository commentRepository,
            CommentMapper commentMapper,
            StockRepository stockRepository
    ) {
        this.commentRepository = commentRepository;
        this.commentMapper = commentMapper;
        this.stockRepository = stockRepository;
    }

    public List<CommentDto> getCommentsByStockId(Long stockId) {
        return commentRepository.findByStockId(stockId).stream()
                .map(commentMapper::toDto)
                .toList();
    }

    public CommentDto createComment(CreateCommentDto dto) {
        Stock stock = stockRepository.findById(dto.stockId())
                .orElseThrow(() -> new StockNotFoundException(dto.stockId()));

        Comment comment = new Comment(dto.content());
        comment.setStock(stock);

        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toDto(savedComment);
    }

    public CommentDto updateContent(Long id, UpdateCommentDto dto) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException(id));

        comment.setContent(dto.content());
        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toDto(savedComment);
    }

    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException(id));

        commentRepository.delete(comment);
    }
}