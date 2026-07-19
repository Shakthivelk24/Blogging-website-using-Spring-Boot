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

    public List<Post> getAllPosts() {
        return repo.findAll();
    }
    
    public Post getPostById(Long id) {
        return repo.findById(id).orElse(null);
    }
    
    public Post createPost(Post post) {
        return repo.save(post);
    }

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

    public void deletePost(Long id) {
        repo.deleteById(id);
    }
}
