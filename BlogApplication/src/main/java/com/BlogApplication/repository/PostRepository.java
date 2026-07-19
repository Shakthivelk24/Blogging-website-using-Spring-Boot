package com.BlogApplication.repository;
import com.BlogApplication.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {   
} 
