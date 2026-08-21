package com.BlogApplication.Controller;

import com.BlogApplication.model.Post;
import com.BlogApplication.Service.PostService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostControllerTest {

    @Mock
    private PostService postService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private PostController postController;


    // =========================================================
    // GET ALL POSTS
    // =========================================================

    @Test
    void getAllPosts_whenAuthenticationIsNull_shouldReturnAllPosts() {

        List<Post> posts = List.of(new Post());

        when(postService.getAllPosts())
                .thenReturn(posts);

        List<Post> result =
                postController.getAllPosts(null);

        assertEquals(posts, result);

        verify(postService)
                .getAllPosts();

        verify(postService, never())
                .getAllPostsExceptUser(anyString());
    }


    @Test
    void getAllPosts_whenUsernameIsNull_shouldReturnAllPosts() {

        List<Post> posts = List.of(new Post());

        when(authentication.getName())
                .thenReturn(null);

        when(postService.getAllPosts())
                .thenReturn(posts);

        List<Post> result =
                postController.getAllPosts(authentication);

        assertEquals(posts, result);

        verify(postService)
                .getAllPosts();

        verify(postService, never())
                .getAllPostsExceptUser(anyString());
    }


    @Test
    void getAllPosts_whenAnonymousUser_shouldReturnAllPosts() {

        List<Post> posts = List.of(new Post());

        when(authentication.getName())
                .thenReturn("anonymousUser");

        when(postService.getAllPosts())
                .thenReturn(posts);

        List<Post> result =
                postController.getAllPosts(authentication);

        assertEquals(posts, result);

        verify(postService)
                .getAllPosts();

        verify(postService, never())
                .getAllPostsExceptUser(anyString());
    }


    @Test
    void getAllPosts_whenLoggedIn_shouldExcludeOwnPosts() {

        List<Post> posts = List.of(new Post());

        when(authentication.getName())
                .thenReturn("shakthi");

        when(postService.getAllPostsExceptUser("shakthi"))
                .thenReturn(posts);

        List<Post> result =
                postController.getAllPosts(authentication);

        assertEquals(posts, result);

        verify(postService)
                .getAllPostsExceptUser("shakthi");

        verify(postService, never())
                .getAllPosts();
    }


    // =========================================================
    // SEARCH POSTS
    // =========================================================

    @Test
    void getSearchedPosts_whenAuthenticationIsNull_shouldSearchAllPosts() {

        List<Post> posts = List.of(new Post());

        when(postService.getSearchedPosts("java"))
                .thenReturn(posts);

        List<Post> result =
                postController.getSearchedPosts(
                        "java",
                        null
                );

        assertEquals(posts, result);

        verify(postService)
                .getSearchedPosts("java");

        verify(postService, never())
                .getSearchedPostsExceptUser(
                        anyString(),
                        anyString()
                );
    }


    @Test
    void getSearchedPosts_whenUsernameIsNull_shouldSearchAllPosts() {

        List<Post> posts = List.of(new Post());

        when(authentication.getName())
                .thenReturn(null);

        when(postService.getSearchedPosts("java"))
                .thenReturn(posts);

        List<Post> result =
                postController.getSearchedPosts(
                        "java",
                        authentication
                );

        assertEquals(posts, result);

        verify(postService)
                .getSearchedPosts("java");
    }


    @Test
    void getSearchedPosts_whenAnonymousUser_shouldSearchAllPosts() {

        List<Post> posts = List.of(new Post());

        when(authentication.getName())
                .thenReturn("anonymousUser");

        when(postService.getSearchedPosts("java"))
                .thenReturn(posts);

        List<Post> result =
                postController.getSearchedPosts(
                        "java",
                        authentication
                );

        assertEquals(posts, result);

        verify(postService)
                .getSearchedPosts("java");
    }


    @Test
    void getSearchedPosts_whenLoggedIn_shouldExcludeOwnPosts() {

        List<Post> posts = List.of(new Post());

        when(authentication.getName())
                .thenReturn("shakthi");

        when(postService.getSearchedPostsExceptUser(
                "java",
                "shakthi"
        )).thenReturn(posts);

        List<Post> result =
                postController.getSearchedPosts(
                        "java",
                        authentication
                );

        assertEquals(posts, result);

        verify(postService)
                .getSearchedPostsExceptUser(
                        "java",
                        "shakthi"
                );

        verify(postService, never())
                .getSearchedPosts(anyString());
    }


    // =========================================================
    // GET USER POSTS
    // =========================================================

    @Test
    void getUserPosts_shouldReturnUserPosts() {

        List<Post> posts = List.of(new Post());

        when(authentication.getName())
                .thenReturn("shakthi");

        when(postService.getUserPosts("shakthi"))
                .thenReturn(posts);

        List<Post> result =
                postController.getUserPosts(authentication);

        assertEquals(posts, result);

        verify(authentication)
                .getName();

        verify(postService)
                .getUserPosts("shakthi");
    }


    // =========================================================
    // GET POST BY ID
    // =========================================================

    @Test
    void getPostById_whenPostExists_shouldReturnOk() {

        Post post = new Post();

        when(postService.getPostById(1L))
                .thenReturn(post);

        ResponseEntity<Post> response =
                postController.getPostById(1L);

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertEquals(
                post,
                response.getBody()
        );

        verify(postService)
                .getPostById(1L);
    }


    @Test
    void getPostById_whenPostDoesNotExist_shouldReturnNotFound() {

        when(postService.getPostById(1L))
                .thenReturn(null);

        ResponseEntity<Post> response =
                postController.getPostById(1L);

        assertEquals(
                HttpStatus.NOT_FOUND,
                response.getStatusCode()
        );

        assertNull(response.getBody());

        verify(postService)
                .getPostById(1L);
    }


    // =========================================================
    // CREATE POST
    // =========================================================

    @Test
    void createPost_shouldSetAuthorAndCreatePost() {

        Post post = new Post();

        Post savedPost = new Post();

        when(authentication.getName())
                .thenReturn("shakthi");

        when(postService.createPost(post))
                .thenReturn(savedPost);

        ResponseEntity<Post> response =
                postController.createPost(
                        post,
                        authentication
                );

        assertEquals(
                HttpStatus.CREATED,
                response.getStatusCode()
        );

        assertEquals(
                savedPost,
                response.getBody()
        );

        assertEquals(
                "shakthi",
                post.getAuthor()
        );

        verify(authentication)
                .getName();

        verify(postService)
                .createPost(post);
    }


    // =========================================================
    // UPDATE POST
    // =========================================================

    @Test
    void updatePost_whenSuccessful_shouldReturnUpdatedPost() {

        Post post = new Post();

        Post updatedPost = new Post();

        when(authentication.getName())
                .thenReturn("shakthi");

        when(postService.updatePost(
                1L,
                post,
                "shakthi"
        )).thenReturn(updatedPost);

        ResponseEntity<?> response =
                postController.updatePost(
                        1L,
                        post,
                        authentication
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        assertEquals(
                updatedPost,
                response.getBody()
        );

        verify(postService)
                .updatePost(
                        1L,
                        post,
                        "shakthi"
                );
    }


    @Test
    void updatePost_whenNotOwner_shouldReturnForbidden() {

        Post post = new Post();

        when(authentication.getName())
                .thenReturn("shakthi");

        when(postService.updatePost(
                1L,
                post,
                "shakthi"
        )).thenReturn(null);

        ResponseEntity<?> response =
                postController.updatePost(
                        1L,
                        post,
                        authentication
                );

        assertEquals(
                HttpStatus.FORBIDDEN,
                response.getStatusCode()
        );

        Map<?, ?> body =
                (Map<?, ?>) response.getBody();

        assertEquals(
                "You cannot edit this post",
                body.get("message")
        );

        verify(postService)
                .updatePost(
                        1L,
                        post,
                        "shakthi"
                );
    }


    // =========================================================
    // DELETE POST
    // =========================================================

    @Test
    void deletePost_whenSuccessful_shouldReturnOk() {

        when(authentication.getName())
                .thenReturn("shakthi");

        when(postService.deletePost(
                1L,
                "shakthi"
        )).thenReturn(true);

        ResponseEntity<?> response =
                postController.deletePost(
                        1L,
                        authentication
                );

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );

        Map<?, ?> body =
                (Map<?, ?>) response.getBody();

        assertEquals(
                "Post deleted successfully",
                body.get("message")
        );

        verify(postService)
                .deletePost(
                        1L,
                        "shakthi"
                );
    }


    @Test
    void deletePost_whenNotOwner_shouldReturnForbidden() {

        when(authentication.getName())
                .thenReturn("shakthi");

        when(postService.deletePost(
                1L,
                "shakthi"
        )).thenReturn(false);

        ResponseEntity<?> response =
                postController.deletePost(
                        1L,
                        authentication
                );

        assertEquals(
                HttpStatus.FORBIDDEN,
                response.getStatusCode()
        );

        Map<?, ?> body =
                (Map<?, ?>) response.getBody();

        assertEquals(
                "You cannot delete this post",
                body.get("message")
        );

        verify(postService)
                .deletePost(
                        1L,
                        "shakthi"
                );
    }
}