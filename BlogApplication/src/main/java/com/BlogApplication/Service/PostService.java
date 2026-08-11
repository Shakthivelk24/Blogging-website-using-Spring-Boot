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

    // =========================
    // Get ALL posts
    // =========================
    public List<Post> getAllPosts() {
        return repo.findAll();
    }

    // =========================
    // Get all posts EXCEPT
    // logged-in user's posts
    // =========================
    public List<Post> getAllPostsExceptUser(String username) {

        System.out.println(
                "Excluding posts of user: " + username);

        return repo.findPostsExceptAuthor(username);
    }

    // =========================
    // Get post by ID
    // =========================
    public Post getPostById(Long id) {
        return repo.findById(id).orElse(null);
    }

    // =========================
    // Search posts
    // =========================
    public List<Post> getSearchedPosts(String keyword) {
        return repo.searchPosts(keyword);
    }

    // =========================
    // Search posts except user
    // =========================
    public List<Post> getSearchedPostsExceptUser(
            String keyword,
            String username) {

        return repo.searchPostsExceptUser(
                keyword,
                username);
    }

    // =========================
    // Get logged-in user's posts
    // =========================
    public List<Post> getUserPosts(String username) {
        return repo.findByAuthor(username);
    }

    // =========================
    // Create post
    // =========================
    public Post createPost(Post post) {
        return repo.save(post);
    }

    // =========================
    // Update post
    // =========================
    public Post updatePost(
            Long id,
            Post postDetails,
            String username) {

        Post post = repo.findById(id).orElse(null);

        if (post == null) {
            return null;
        }

        // Check ownership
        if (!post.getAuthor().equalsIgnoreCase(username)) {
            return null;
        }

        post.setTitle(postDetails.getTitle());
        post.setContent(postDetails.getContent());

        // DO NOT change author

        return repo.save(post);
    }

    // =========================
    // Delete post
    // =========================
    public boolean deletePost(
            Long id,
            String username) {

        Post post = repo.findById(id).orElse(null);

        if (post == null) {
            return false;
        }

        // Check ownership
        if (!post.getAuthor().equalsIgnoreCase(username)) {
            return false;
        }

        repo.delete(post);

        return true;
    }
}