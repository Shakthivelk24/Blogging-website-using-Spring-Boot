package com.BlogApplication.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BlogApplication.repository.PostRepository;
import com.BlogApplication.model.Post;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository repo;

    // Get all posts
    public List<Post> getAllPosts() {
        return repo.findAll();
    }

    // Get post by ID
    public Post getPostById(Long id) {
        return repo.findById(id).orElse(null);
    }

    // Search posts
    public List<Post> getSearchedPosts(String keyword) {
        return repo.searchPosts(keyword);
    }

    // Get posts of a particular user
    public List<Post> getUserPosts(String username) {
        return repo.findByAuthor(username);
    }

    // Create post
    public Post createPost(Post post) {
        return repo.save(post);
    }

    // Update post
    public Post updatePost(Long id, Post postDetails) {

        Post post = repo.findById(id).orElse(null);

        if (post != null) {
            post.setTitle(postDetails.getTitle());
            post.setContent(postDetails.getContent());
            post.setAuthor(postDetails.getAuthor());

            return repo.save(post);
        }

        return null;
    }

    // Delete post
    public void deletePost(Long id) {
        repo.deleteById(id);
    }
}
