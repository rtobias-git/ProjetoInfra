package br.edu.bookflow.repository;

import br.edu.bookflow.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByCategoryId(Long categoryId);
    boolean existsByIsbn(String isbn);
}
