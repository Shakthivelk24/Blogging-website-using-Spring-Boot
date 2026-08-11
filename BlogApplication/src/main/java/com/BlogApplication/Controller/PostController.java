package com.BlogApplication.Controller;

import com.BlogApplication.model.Post;
import com.BlogApplication.Service.PostService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    // =====================================================
    // GET ALL POSTS
    // GET /api/posts
    //
    // NOT LOGGED IN:
    // → Show ALL posts
    //
    // LOGGED IN:
    // → Hide user's own posts
    // =====================================================

    @GetMapping
    public List<Post> getAllPosts(
            Authentication authentication) {

        // No user logged in
        if (authentication == null ||
                authentication.getName() == null ||
                authentication.getName().equals("anonymousUser")) {

            return postService.getAllPosts();
        }

        // User logged in
        String username = authentication.getName();

        System.out.println(
                "Logged-in user: " + username);

        return postService.getAllPostsExceptUser(username);
    }

    // =========================
    // Search posts
    // GET /api/posts/search?keyword=java
    // =========================
    @GetMapping("/search")
    public List<Post> getSearchedPosts(
            @RequestParam String keyword,
            Authentication authentication) {

        // Not logged in → search ALL posts
        if (authentication == null ||
                authentication.getName() == null ||
                authentication.getName().equals("anonymousUser")) {

            return postService.getSearchedPosts(keyword);
        }

        // Logged in → search excluding own posts
        String username = authentication.getName();

        return postService.getSearchedPostsExceptUser(
                keyword,
                username);
    }

    // =====================================================
    // GET MY POSTS
    // GET /api/posts/user
    //
    // LOGIN REQUIRED
    // =====================================================

    @GetMapping("/user")
    public List<Post> getUserPosts(
            Authentication authentication) {

        String username = authentication.getName();

        return postService.getUserPosts(username);
    }

    // =====================================================
    // GET POST BY ID
    // GET /api/posts/{id}
    //
    // PUBLIC
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(
            @PathVariable Long id) {

        Post post = postService.getPostById(id);

        if (post == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(post);
    }

    // =====================================================
    // CREATE POST
    // POST /api/posts
    //
    // LOGIN REQUIRED
    // =====================================================

    @PostMapping
    public ResponseEntity<Post> createPost(
            @RequestBody Post post,
            Authentication authentication) {

        // Author comes from JWT
        String username = authentication.getName();

        post.setAuthor(username);

        Post savedPost = postService.createPost(post);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedPost);
    }

    // =====================================================
    // UPDATE POST
    // PUT /api/posts/{id}
    //
    // LOGIN REQUIRED
    // OWNER ONLY
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @RequestBody Post post,
            Authentication authentication) {

        String username = authentication.getName();

        Post updatedPost = postService.updatePost(
                id,
                post,
                username);

        if (updatedPost == null) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            java.util.Map.of(
                                    "message",
                                    "You cannot edit this post"));
        }

        return ResponseEntity.ok(updatedPost);
    }

    // =====================================================
    // DELETE POST
    // DELETE /api/posts/{id}
    //
    // LOGIN REQUIRED
    // OWNER ONLY
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long id,
            Authentication authentication) {

        String username = authentication.getName();

        boolean deleted = postService.deletePost(
                id,
                username);

        if (!deleted) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            java.util.Map.of(
                                    "message",
                                    "You cannot delete this post"));
        }

        return ResponseEntity.ok(
                java.util.Map.of(
                        "message",
                        "Post deleted successfully"));
    }
}