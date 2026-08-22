package com.BlogApplication.security;

import com.BlogApplication.Service.CustomUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private JwtAuthenticationFilter jwtAuthenticationFilter;


    @BeforeEach
    void setUp() {

        SecurityContextHolder.clearContext();
    }


    @AfterEach
    void tearDown() {

        SecurityContextHolder.clearContext();
    }


    // =========================================================
    // 1. NO COOKIES
    // =========================================================

    @Test
    void doFilterInternal_whenNoCookies_shouldContinueFilterChain()
            throws ServletException, IOException {

        when(request.getCookies()).thenReturn(null);

        jwtAuthenticationFilter.doFilterInternal(
                request,
                response,
                filterChain
        );

        verify(filterChain)
                .doFilter(request, response);

        verifyNoInteractions(jwtService);
        verifyNoInteractions(userDetailsService);

        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );
    }


    // =========================================================
    // 2. COOKIES EXIST BUT JWT COOKIE DOES NOT EXIST
    // =========================================================

    @Test
    void doFilterInternal_whenJwtCookieIsMissing_shouldContinueFilterChain()
            throws ServletException, IOException {

        Cookie sessionCookie =
                new Cookie("session", "abc123");

        Cookie anotherCookie =
                new Cookie("user", "shakthi");

        when(request.getCookies())
                .thenReturn(
                        new Cookie[]{
                                sessionCookie,
                                anotherCookie
                        }
                );

        jwtAuthenticationFilter.doFilterInternal(
                request,
                response,
                filterChain
        );

        verify(filterChain)
                .doFilter(request, response);

        verifyNoInteractions(jwtService);
        verifyNoInteractions(userDetailsService);

        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );
    }


    // =========================================================
    // 3. VALID JWT + VALID USER + NO EXISTING AUTHENTICATION
    // =========================================================

    @Test
    void doFilterInternal_whenValidJwt_shouldAuthenticateUser()
            throws ServletException, IOException {

        Cookie jwtCookie =
                new Cookie("jwt", "valid-token");

        when(request.getCookies())
                .thenReturn(
                        new Cookie[]{
                                jwtCookie
                        }
                );

        when(jwtService.extractUsername("valid-token"))
                .thenReturn("shakthi");

        when(userDetailsService.loadUserByUsername("shakthi"))
                .thenReturn(userDetails);

        when(userDetails.getUsername())
                .thenReturn("shakthi");

        when(userDetails.getAuthorities())
                .thenReturn(Collections.emptyList());

        when(jwtService.isTokenValid(
                "valid-token",
                "shakthi"
        )).thenReturn(true);


        jwtAuthenticationFilter.doFilterInternal(
                request,
                response,
                filterChain
        );


        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        assertNotNull(authentication);

        assertInstanceOf(
                UsernamePasswordAuthenticationToken.class,
                authentication
        );

        assertEquals(
                userDetails,
                authentication.getPrincipal()
        );


        verify(jwtService)
                .extractUsername("valid-token");

        verify(userDetailsService)
                .loadUserByUsername("shakthi");

        verify(jwtService)
                .isTokenValid(
                        "valid-token",
                        "shakthi"
                );

        verify(filterChain)
                .doFilter(request, response);
    }


    // =========================================================
    // 4. USERNAME IS NULL
    // =========================================================

    @Test
    void doFilterInternal_whenUsernameIsNull_shouldNotAuthenticate()
            throws ServletException, IOException {

        Cookie jwtCookie =
                new Cookie("jwt", "valid-token");

        when(request.getCookies())
                .thenReturn(
                        new Cookie[]{
                                jwtCookie
                        }
                );

        when(jwtService.extractUsername("valid-token"))
                .thenReturn(null);


        jwtAuthenticationFilter.doFilterInternal(
                request,
                response,
                filterChain
        );


        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );


        verify(jwtService)
                .extractUsername("valid-token");

        verifyNoInteractions(userDetailsService);

        verify(filterChain)
                .doFilter(request, response);
    }


    // =========================================================
    // 5. AUTHENTICATION ALREADY EXISTS
    // =========================================================

    @Test
    void doFilterInternal_whenAuthenticationAlreadyExists_shouldNotAuthenticateAgain()
            throws ServletException, IOException {

        Cookie jwtCookie =
                new Cookie("jwt", "valid-token");

        when(request.getCookies())
                .thenReturn(
                        new Cookie[]{
                                jwtCookie
                        }
                );

        when(jwtService.extractUsername("valid-token"))
                .thenReturn("shakthi");


        Authentication existingAuthentication =
                mock(Authentication.class);

        SecurityContextHolder
                .getContext()
                .setAuthentication(
                        existingAuthentication
                );


        jwtAuthenticationFilter.doFilterInternal(
                request,
                response,
                filterChain
        );


        assertSame(
                existingAuthentication,
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );


        verify(jwtService)
                .extractUsername("valid-token");

        verifyNoInteractions(userDetailsService);

        verify(jwtService, never())
                .isTokenValid(
                        anyString(),
                        anyString()
                );

        verify(filterChain)
                .doFilter(request, response);
    }


    // =========================================================
    // 6. JWT IS INVALID
    // =========================================================

    @Test
    void doFilterInternal_whenJwtIsInvalid_shouldNotAuthenticate()
            throws ServletException, IOException {

        Cookie jwtCookie =
                new Cookie("jwt", "invalid-token");

        when(request.getCookies())
                .thenReturn(
                        new Cookie[]{
                                jwtCookie
                        }
                );

        when(jwtService.extractUsername("invalid-token"))
                .thenReturn("shakthi");

        when(userDetailsService.loadUserByUsername("shakthi"))
                .thenReturn(userDetails);

        when(userDetails.getUsername())
                .thenReturn("shakthi");

        when(jwtService.isTokenValid(
                "invalid-token",
                "shakthi"
        )).thenReturn(false);


        jwtAuthenticationFilter.doFilterInternal(
                request,
                response,
                filterChain
        );


        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );


        verify(jwtService)
                .extractUsername("invalid-token");

        verify(userDetailsService)
                .loadUserByUsername("shakthi");

        verify(jwtService)
                .isTokenValid(
                        "invalid-token",
                        "shakthi"
                );

        verify(filterChain)
                .doFilter(request, response);
    }


    // =========================================================
    // 7. JWT EXTRACTION THROWS EXCEPTION
    // =========================================================

    @Test
    void doFilterInternal_whenJwtExtractionFails_shouldClearContext()
            throws ServletException, IOException {

        Cookie jwtCookie =
                new Cookie("jwt", "broken-token");

        when(request.getCookies())
                .thenReturn(
                        new Cookie[]{
                                jwtCookie
                        }
                );

        when(jwtService.extractUsername("broken-token"))
                .thenThrow(
                        new RuntimeException("Invalid JWT")
                );


        Authentication existingAuthentication =
                mock(Authentication.class);

        SecurityContextHolder
                .getContext()
                .setAuthentication(
                        existingAuthentication
                );


        jwtAuthenticationFilter.doFilterInternal(
                request,
                response,
                filterChain
        );


        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );


        verify(jwtService)
                .extractUsername("broken-token");

        verify(filterChain)
                .doFilter(request, response);

        verifyNoInteractions(userDetailsService);
    }


    // =========================================================
    // 8. USER DETAILS SERVICE THROWS EXCEPTION
    // =========================================================

    @Test
    void doFilterInternal_whenUserNotFound_shouldClearContext()
            throws ServletException, IOException {

        Cookie jwtCookie =
                new Cookie("jwt", "valid-token");

        when(request.getCookies())
                .thenReturn(
                        new Cookie[]{
                                jwtCookie
                        }
                );

        when(jwtService.extractUsername("valid-token"))
                .thenReturn("unknownUser");

        when(userDetailsService.loadUserByUsername("unknownUser"))
                .thenThrow(
                        new RuntimeException("User not found")
                );


        jwtAuthenticationFilter.doFilterInternal(
                request,
                response,
                filterChain
        );


        assertNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );


        verify(jwtService)
                .extractUsername("valid-token");

        verify(userDetailsService)
                .loadUserByUsername("unknownUser");

        verify(filterChain)
                .doFilter(request, response);
    }


    // =========================================================
    // 9. MULTIPLE COOKIES WITH JWT
    // =========================================================

    @Test
    void doFilterInternal_whenJwtCookieExistsAmongOtherCookies_shouldUseJwt()
            throws ServletException, IOException {

        Cookie sessionCookie =
                new Cookie("session", "abc");

        Cookie themeCookie =
                new Cookie("theme", "dark");

        Cookie jwtCookie =
                new Cookie("jwt", "valid-token");

        when(request.getCookies())
                .thenReturn(
                        new Cookie[]{
                                sessionCookie,
                                themeCookie,
                                jwtCookie
                        }
                );

        when(jwtService.extractUsername("valid-token"))
                .thenReturn("shakthi");

        when(userDetailsService.loadUserByUsername("shakthi"))
                .thenReturn(userDetails);

        when(userDetails.getUsername())
                .thenReturn("shakthi");

        when(userDetails.getAuthorities())
                .thenReturn(Collections.emptyList());

        when(jwtService.isTokenValid(
                "valid-token",
                "shakthi"
        )).thenReturn(true);


        jwtAuthenticationFilter.doFilterInternal(
                request,
                response,
                filterChain
        );


        assertNotNull(
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );


        verify(jwtService)
                .extractUsername("valid-token");

        verify(filterChain)
                .doFilter(request, response);
    }
}