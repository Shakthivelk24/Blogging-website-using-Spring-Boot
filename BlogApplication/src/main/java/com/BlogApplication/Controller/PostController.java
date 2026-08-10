package com.BlogApplication.Controller;

import com.BlogApplication.model.Post;
import com.BlogApplication.Service.PostService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    // Get all posts
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    // Search posts
    // GET /api/posts/search?keyword=java
    @GetMapping("/search")
    public List<Post> getSearchedPosts(
            @RequestParam String keyword) {

        return postService.getSearchedPosts(keyword);
    }

    // Get posts of logged-in user
    // GET /api/posts/user
    @GetMapping("/user")
    public List<Post> getUserPosts(
            Authentication authentication) {

        String username = authentication.getName();

        return postService.getUserPosts(username);
    }

    // Get post by ID
    @GetMapping("/{id}")
    public Post getPostById(@PathVariable Long id) {
        return postService.getPostById(id);
    }

    // Create post
    @PostMapping
    public Post createPost(
            @RequestBody Post post,
            Authentication authentication) {

        // Get author from JWT instead of trusting frontend
        post.setAuthor(authentication.getName());

        return postService.createPost(post);
    }

    // Update post
    @PutMapping("/{id}")
    public Post updatePost(
            @PathVariable Long id,
            @RequestBody Post post) {

        return postService.updatePost(id, post);
    }

    // Delete post
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id) {
        postService.deletePost(id);
    }
}

