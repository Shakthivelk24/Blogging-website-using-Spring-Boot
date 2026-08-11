package com.BlogApplication.repository;

import com.BlogApplication.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // Get posts by author
    List<Post> findByAuthor(String author);


    // Get all posts except specified author
    @Query("""
        SELECT p FROM Post p
        WHERE LOWER(p.author) <> LOWER(:username)
    """)
    List<Post> findPostsExceptAuthor(
            @Param("username") String username
    );


    // Search all posts
    @Query("""
        SELECT p FROM Post p
        WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    List<Post> searchPosts(
            @Param("keyword") String keyword
    );


    // Search posts except logged-in user's posts
    @Query("""
        SELECT p FROM Post p
        WHERE LOWER(p.author) <> LOWER(:username)
          AND (
              LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
              OR
              LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))
          )
    """)
    List<Post> searchPostsExceptUser(
            @Param("keyword") String keyword,
            @Param("username") String username
    );
}