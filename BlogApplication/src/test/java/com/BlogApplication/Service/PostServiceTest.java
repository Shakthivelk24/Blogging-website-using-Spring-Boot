package com.BlogApplication.Service;

import com.BlogApplication.model.Post;
import com.BlogApplication.repository.PostRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository repo;

    @InjectMocks
    private PostService postService;


    // =========================================================
    // GET ALL POSTS
    // =========================================================

    @Test
    void getAllPosts_shouldReturnAllPosts() {

        List<Post> posts =
                List.of(new Post(), new Post());

        when(repo.findAll())
                .thenReturn(posts);

        List<Post> result =
                postService.getAllPosts();

        assertEquals(posts, result);

        verify(repo)
                .findAll();
    }


    // =========================================================
    // GET ALL POSTS EXCEPT USER
    // =========================================================

    @Test
    void getAllPostsExceptUser_shouldReturnPosts() {

        List<Post> posts =
                List.of(new Post());

        when(repo.findPostsExceptAuthor("shakthi"))
                .thenReturn(posts);

        List<Post> result =
                postService.getAllPostsExceptUser(
                        "shakthi"
                );

        assertEquals(posts, result);

        verify(repo)
                .findPostsExceptAuthor("shakthi");
    }


    // =========================================================
    // GET POST BY ID - EXISTS
    // =========================================================

    @Test
    void getPostById_whenPostExists_shouldReturnPost() {

        Post post = new Post();

        when(repo.findById(1L))
                .thenReturn(Optional.of(post));

        Post result =
                postService.getPostById(1L);

        assertEquals(post, result);

        verify(repo)
                .findById(1L);
    }


    // =========================================================
    // GET POST BY ID - DOES NOT EXIST
    // =========================================================

    @Test
    void getPostById_whenPostDoesNotExist_shouldReturnNull() {

        when(repo.findById(1L))
                .thenReturn(Optional.empty());

        Post result =
                postService.getPostById(1L);

        assertNull(result);

        verify(repo)
                .findById(1L);
    }


    // =========================================================
    // SEARCH POSTS
    // =========================================================

    @Test
    void getSearchedPosts_shouldReturnMatchingPosts() {

        List<Post> posts =
                List.of(new Post());

        when(repo.searchPosts("java"))
                .thenReturn(posts);

        List<Post> result =
                postService.getSearchedPosts("java");

        assertEquals(posts, result);

        verify(repo)
                .searchPosts("java");
    }


    // =========================================================
    // SEARCH POSTS EXCEPT USER
    // =========================================================

    @Test
    void getSearchedPostsExceptUser_shouldReturnPosts() {

        List<Post> posts =
                List.of(new Post());

        when(repo.searchPostsExceptUser(
                "java",
                "shakthi"
        )).thenReturn(posts);

        List<Post> result =
                postService.getSearchedPostsExceptUser(
                        "java",
                        "shakthi"
                );

        assertEquals(posts, result);

        verify(repo)
                .searchPostsExceptUser(
                        "java",
                        "shakthi"
                );
    }


    // =========================================================
    // GET USER POSTS
    // =========================================================

    @Test
    void getUserPosts_shouldReturnUserPosts() {

        List<Post> posts =
                List.of(new Post());

        when(repo.findByAuthor("shakthi"))
                .thenReturn(posts);

        List<Post> result =
                postService.getUserPosts("shakthi");

        assertEquals(posts, result);

        verify(repo)
                .findByAuthor("shakthi");
    }


    // =========================================================
    // CREATE POST
    // =========================================================

    @Test
    void createPost_shouldSaveAndReturnPost() {

        Post post = new Post();

        when(repo.save(post))
                .thenReturn(post);

        Post result =
                postService.createPost(post);

        assertEquals(post, result);

        verify(repo)
                .save(post);
    }


    // =========================================================
    // UPDATE POST
    // =========================================================

    @Test
    void updatePost_whenPostDoesNotExist_shouldReturnNull() {

        when(repo.findById(1L))
                .thenReturn(Optional.empty());

        Post postDetails = new Post();

        Post result =
                postService.updatePost(
                        1L,
                        postDetails,
                        "shakthi"
                );

        assertNull(result);

        verify(repo)
                .findById(1L);

        verify(repo, never())
                .save(any(Post.class));
    }


    @Test
    void updatePost_whenUserIsNotOwner_shouldReturnNull() {

        Post existingPost = new Post();

        existingPost.setAuthor("otherUser");

        when(repo.findById(1L))
                .thenReturn(Optional.of(existingPost));

        Post postDetails = new Post();

        postDetails.setTitle("New Title");
        postDetails.setContent("New Content");

        Post result =
                postService.updatePost(
                        1L,
                        postDetails,
                        "shakthi"
                );

        assertNull(result);

        verify(repo)
                .findById(1L);

        verify(repo, never())
                .save(any(Post.class));
    }


    @Test
    void updatePost_whenUserIsOwner_shouldUpdatePost() {

        Post existingPost = new Post();

        existingPost.setAuthor("shakthi");

        Post postDetails = new Post();

        postDetails.setTitle("New Title");
        postDetails.setContent("New Content");

        when(repo.findById(1L))
                .thenReturn(Optional.of(existingPost));

        when(repo.save(existingPost))
                .thenReturn(existingPost);

        Post result =
                postService.updatePost(
                        1L,
                        postDetails,
                        "shakthi"
                );

        assertNotNull(result);

        assertEquals(
                "New Title",
                existingPost.getTitle()
        );

        assertEquals(
                "New Content",
                existingPost.getContent()
        );

        // Author must not change
        assertEquals(
                "shakthi",
                existingPost.getAuthor()
        );

        verify(repo)
                .findById(1L);

        verify(repo)
                .save(existingPost);
    }


    @Test
    void updatePost_whenUsernameHasDifferentCase_shouldAllowUpdate() {

        Post existingPost = new Post();

        existingPost.setAuthor("Shakthi");

        Post postDetails = new Post();

        postDetails.setTitle("Updated Title");
        postDetails.setContent("Updated Content");

        when(repo.findById(1L))
                .thenReturn(Optional.of(existingPost));

        when(repo.save(existingPost))
                .thenReturn(existingPost);

        Post result =
                postService.updatePost(
                        1L,
                        postDetails,
                        "shakthi"
                );

        assertNotNull(result);

        assertEquals(
                "Updated Title",
                existingPost.getTitle()
        );

        assertEquals(
                "Updated Content",
                existingPost.getContent()
        );

        verify(repo)
                .save(existingPost);
    }


    // =========================================================
    // DELETE POST
    // =========================================================

    @Test
    void deletePost_whenPostDoesNotExist_shouldReturnFalse() {

        when(repo.findById(1L))
                .thenReturn(Optional.empty());

        boolean result =
                postService.deletePost(
                        1L,
                        "shakthi"
                );

        assertFalse(result);

        verify(repo)
                .findById(1L);

        verify(repo, never())
                .delete(any(Post.class));
    }


    @Test
    void deletePost_whenUserIsNotOwner_shouldReturnFalse() {

        Post existingPost = new Post();

        existingPost.setAuthor("otherUser");

        when(repo.findById(1L))
                .thenReturn(Optional.of(existingPost));

        boolean result =
                postService.deletePost(
                        1L,
                        "shakthi"
                );

        assertFalse(result);

        verify(repo)
                .findById(1L);

        verify(repo, never())
                .delete(any(Post.class));
    }


    @Test
    void deletePost_whenUserIsOwner_shouldDeletePost() {

        Post existingPost = new Post();

        existingPost.setAuthor("shakthi");

        when(repo.findById(1L))
                .thenReturn(Optional.of(existingPost));

        boolean result =
                postService.deletePost(
                        1L,
                        "shakthi"
                );

        assertTrue(result);

        verify(repo)
                .findById(1L);

        verify(repo)
                .delete(existingPost);
    }


    @Test
    void deletePost_whenUsernameHasDifferentCase_shouldDeletePost() {

        Post existingPost = new Post();

        existingPost.setAuthor("Shakthi");

        when(repo.findById(1L))
                .thenReturn(Optional.of(existingPost));

        boolean result =
                postService.deletePost(
                        1L,
                        "shakthi"
                );

        assertTrue(result);

        verify(repo)
                .delete(existingPost);
    }
}