package com.BlogApplication.Service;

import com.BlogApplication.model.User;
import com.BlogApplication.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService userDetailsService;


    // =========================================================
    // USER EXISTS
    // =========================================================

    @Test
    void loadUserByUsername_whenUserExists_shouldReturnUserDetails() {

        User user = User.builder()
                .username("shakthi")
                .password("encodedPassword")
                .role("USER")
                .build();

        when(userRepository.findByUsername("shakthi"))
                .thenReturn(Optional.of(user));


        UserDetails result =
                userDetailsService.loadUserByUsername("shakthi");


        assertNotNull(result);

        assertEquals(
                "shakthi",
                result.getUsername()
        );

        assertEquals(
                "encodedPassword",
                result.getPassword()
        );

        assertTrue(
                result.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_USER")
                        )
        );

        verify(userRepository)
                .findByUsername("shakthi");
    }


    // =========================================================
    // USER NOT FOUND
    // =========================================================

    @Test
    void loadUserByUsername_whenUserDoesNotExist_shouldThrowException() {

        when(userRepository.findByUsername("shakthi"))
                .thenReturn(Optional.empty());


        UsernameNotFoundException exception =
                assertThrows(
                        UsernameNotFoundException.class,
                        () -> userDetailsService
                                .loadUserByUsername("shakthi")
                );


        assertEquals(
                "User not found: shakthi",
                exception.getMessage()
        );

        verify(userRepository)
                .findByUsername("shakthi");
    }


    // =========================================================
    // ADMIN ROLE
    // =========================================================

    @Test
    void loadUserByUsername_whenUserIsAdmin_shouldReturnAdminAuthority() {

        User user = User.builder()
                .username("admin")
                .password("adminPassword")
                .role("ADMIN")
                .build();

        when(userRepository.findByUsername("admin"))
                .thenReturn(Optional.of(user));


        UserDetails result =
                userDetailsService.loadUserByUsername("admin");


        assertNotNull(result);

        assertEquals(
                "admin",
                result.getUsername()
        );

        assertEquals(
                "adminPassword",
                result.getPassword()
        );

        assertTrue(
                result.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_ADMIN")
                        )
        );

        verify(userRepository)
                .findByUsername("admin");
    }
}