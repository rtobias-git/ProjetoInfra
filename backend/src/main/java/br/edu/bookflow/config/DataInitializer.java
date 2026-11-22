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
                Category catFic = catRepo.save(new Category("Ficção Científica"));
                Category catHist = catRepo.save(new Category("História"));
                Category catFilo = catRepo.save(new Category("Filosofia"));

                bookRepo.save(new Book("Código Limpo", "Robert C. Martin", "9788576082675", catTec, true));
                bookRepo.save(new Book("O Programador Pragmático", "Andrew Hunt", "9788577807000", catTec, true));
                bookRepo.save(new Book("Duna", "Frank Herbert", "9788576573135", catFic, false));
                bookRepo.save(new Book("Sapiens", "Yuval Noah Harari", "9788525432186", catHist, true));
            }

            if (userRepo.count() == 0) {
                userRepo.save(new User("Administrador", "admin@ifsp.edu.br", "123456", Role.ADMIN));
                userRepo.save(new User("Aluno", "aluno@ifsp.edu.br", "123456", Role.USER));
            }
        };
    }
}
