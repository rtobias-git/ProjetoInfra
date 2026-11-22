package br.edu.bookflow.config;

import br.edu.bookflow.model.Book;
import br.edu.bookflow.model.Category;
import br.edu.bookflow.model.Role;
import br.edu.bookflow.model.User;
import br.edu.bookflow.repository.BookRepository;
import br.edu.bookflow.repository.CategoryRepository;
import br.edu.bookflow.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(CategoryRepository catRepo, BookRepository bookRepo, UserRepository userRepo) {
        return args -> {
            if (catRepo.count() == 0) {
                Category catTec = catRepo.save(new Category("Tecnologia"));
                Category catEng = catRepo.save(new Category("Engenharia"));
                Category catFic = catRepo.save(new Category("Ficção"));
                Category catLit = catRepo.save(new Category("Literatura"));

                bookRepo.save(new Book("Clean Code", "Robert C. Martin", "978-0132350884", catTec, true));
                bookRepo.save(new Book("Design Patterns", "Erich Gamma, Richard Helm", "978-0201633610", catEng, true));
                bookRepo.save(new Book("O Senhor dos Anéis", "J.R.R. Tolkien", "978-8595084759", catFic, true));
                bookRepo.save(new Book("Dom Casmurro", "Machado de Assis", "978-8572328227", catLit, true));
                bookRepo.save(new Book("Arquitetura Limpa", "Robert C. Martin", "978-8550804606", catTec, false));
            }

            if (userRepo.count() == 0) {
                userRepo.save(new User("Administrador", "bibliotecario@email.com", "123456", Role.ADMIN));
            }
        };
    }
}
