package br.edu.bookflow.controller;

import br.edu.bookflow.model.Book;
import br.edu.bookflow.model.Category;
import br.edu.bookflow.repository.BookRepository;
import br.edu.bookflow.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public BookController(BookRepository bookRepository, CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Book> listAll(@RequestParam(required = false) Long categoryId) {
        if (categoryId != null) {
            return bookRepository.findByCategoryId(categoryId);
        }
        return bookRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getById(@PathVariable Long id) {
        return bookRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Book book) {
        if (book.getCategory() != null && book.getCategory().getId() != null) {
            Optional<Category> cat = categoryRepository.findById(book.getCategory().getId());
            cat.ifPresent(book::setCategory);
        }
        Book saved = bookRepository.save(book);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Book bookDetails) {
        return bookRepository.findById(id).map(book -> {
            book.setTitle(bookDetails.getTitle());
            book.setAuthor(bookDetails.getAuthor());
            book.setIsbn(bookDetails.getIsbn());
            book.setAvailable(bookDetails.isAvailable());
            if (bookDetails.getCategory() != null && bookDetails.getCategory().getId() != null) {
                categoryRepository.findById(bookDetails.getCategory().getId())
                        .ifPresent(book::setCategory);
            }
            return ResponseEntity.ok(bookRepository.save(book));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<?> toggleAvailable(@PathVariable Long id) {
        return bookRepository.findById(id).map(book -> {
            book.setAvailable(!book.isAvailable());
            return ResponseEntity.ok(bookRepository.save(book));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!bookRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bookRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
