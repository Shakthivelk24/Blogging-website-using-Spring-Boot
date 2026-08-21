package com.BlogApplication.Controller;

import com.BlogApplication.model.User;
import com.BlogApplication.repository.UserRepository;
import com.BlogApplication.security.JwtService;

import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    // =========================================================
    // MOCKS
    // =========================================================

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private HttpServletResponse httpServletResponse;

    @InjectMocks
    private AuthController authController;


    // =========================================================
    // SETUP
    // =========================================================

    @BeforeEach
    void setUp() {
        // MockitoExtension automatically initializes mocks.
        // No manual setup is required.
    }


    // =========================================================
    // REGISTER
    // =========================================================

    @Test
    void register_shouldRegisterSuccessfully() {

        AuthController.RegisterRequest request =
                new AuthController.RegisterRequest(
                        "shakthi",
                        "shakthi@gmail.com",
                        "password123"
                );

        when(userRepository.existsByUsername("shakthi"))
                .thenReturn(false);

        when(userRepository.existsByEmail("shakthi@gmail.com"))
                .thenReturn(false);

        when(passwordEncoder.encode("password123"))
                .thenReturn("encodedPassword");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));


        ResponseEntity<?> response =
                authController.register(request);


        // HTTP status
        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );


        // Response body
        assertNotNull(response.getBody());

        Map<?, ?> body =
                (Map<?, ?>) response.getBody();

        assertEquals(
                "Registration successful",
                body.get("message")
        );


        // Verify username check
        verify(userRepository)
                .existsByUsername("shakthi");


        // Verify email check
        verify(userRepository)
                .existsByEmail("shakthi@gmail.com");


        // Verify password encoding
        verify(passwordEncoder)
                .encode("password123");


        // Verify save
        verify(userRepository)
                .save(any(User.class));
    }


    // =========================================================
    // REGISTER - USERNAME ALREADY EXISTS
    // =========================================================

    @Test
    void register_whenUsernameExists_shouldReturnBadRequest() {

        AuthController.RegisterRequest request =
                new AuthController.RegisterRequest(
                        "shakthi",
                        "shakthi@gmail.com",
                        "password123"
                );


        when(userRepository.existsByUsername("shakthi"))
                .thenReturn(true);


        ResponseEntity<?> response =
                authController.register(request);


        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );


        assertNotNull(response.getBody());

        Map<?, ?> body =
                (Map<?, ?>) response.getBody();


        assertEquals(
                "Username already exists",
                body.get("message")
        );


        verify(userRepository)
                .existsByUsername("shakthi");


        verify(userRepository, never())
                .existsByEmail(anyString());


        verify(userRepository, never())
                .save(any(User.class));


        verify(passwordEncoder, never())
                .encode(anyString());
    }


    // =========================================================
    // REGISTER - EMAIL ALREADY EXISTS
    // =========================================================

    @Test
    void register_whenEmailExists_shouldReturnBadRequest() {

        AuthController.RegisterRequest request =
                new AuthController.RegisterRequest(
                        "shakthi",
                        "shakthi@gmail.com",
                        "password123"
                );


        when(userRepository.existsByUsername("shakthi"))
                .thenReturn(false);

        when(userRepository.existsByEmail("shakthi@gmail.com"))
                .thenReturn(true);


        ResponseEntity<?> response =
                authController.register(request);


        assertEquals(
                HttpStatus.BAD_REQUEST,
                response.getStatusCode()
        );


        assertNotNull(response.getBody());

        Map<?, ?> body =
                (Map<?, ?>) response.getBody();


        assertEquals(
                "Email already exists",
                body.get("message")
        );


        verify(userRepository)
                .existsByUsername("shakthi");


        verify(userRepository)
                .existsByEmail("shakthi@gmail.com");


        verify(userRepository, never())
                .save(any(User.class));


        verify(passwordEncoder, never())
                .encode(anyString());
    }


    // =========================================================
    // LOGIN - SUCCESS
    // =========================================================

    @Test
    void login_shouldLoginSuccessfully() {

        AuthController.LoginRequest request =
                new AuthController.LoginRequest(
                        "shakthi",
                        "correctPassword"
                );


        // Authentication succeeds
        when(authenticationManager.authenticate(
                any(UsernamePasswordAuthenticationToken.class)
        )).thenReturn(
                new UsernamePasswordAuthenticationToken(
                        "shakthi",
                        "correctPassword"
                )
        );


        // JWT token
        when(jwtService.generateToken("shakthi"))
                .thenReturn("test-jwt-token");


        ResponseEntity<?> response =
                authController.login(
                        request,
                        httpServletResponse
                );


        // =====================================================
        // STATUS
        // =====================================================

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );


        // =====================================================
        // BODY
        // =====================================================

        assertNotNull(response.getBody());

        Map<?, ?> body =
                (Map<?, ?>) response.getBody();


        assertEquals(
                "Login successful",
                body.get("message")
        );


        // =====================================================
        // VERIFY AUTHENTICATION
        // =====================================================

        verify(authenticationManager)
                .authenticate(
                        any(UsernamePasswordAuthenticationToken.class)
                );


        // =====================================================
        // VERIFY JWT
        // =====================================================

        verify(jwtService)
                .generateToken("shakthi");


        // =====================================================
        // VERIFY COOKIE
        // =====================================================

        verify(httpServletResponse)
                .addHeader(
                        eq(HttpHeaders.SET_COOKIE),
                        anyString()
                );
    }


    // =========================================================
    // LOGIN - FAILURE
    // =========================================================

    @Test
    void login_whenAuthenticationFails_shouldReturnUnauthorized() {

        AuthController.LoginRequest request =
                new AuthController.LoginRequest(
                        "shakthi",
                        "wrongPassword"
                );


        when(authenticationManager.authenticate(
                any(UsernamePasswordAuthenticationToken.class)
        )).thenThrow(
                new RuntimeException("Invalid credentials")
        );


        ResponseEntity<?> response =
                authController.login(
                        request,
                        httpServletResponse
                );


        // =====================================================
        // STATUS
        // =====================================================

        assertEquals(
                HttpStatus.UNAUTHORIZED,
                response.getStatusCode()
        );


        // =====================================================
        // BODY
        // =====================================================

        assertNotNull(response.getBody());

        Map<?, ?> body =
                (Map<?, ?>) response.getBody();


        assertEquals(
                "RuntimeException",
                body.get("message")
        );


        assertEquals(
                "Invalid credentials",
                body.get("error")
        );


        // =====================================================
        // VERIFY AUTHENTICATION
        // =====================================================

        verify(authenticationManager)
                .authenticate(
                        any(UsernamePasswordAuthenticationToken.class)
                );


        // JWT must NOT be generated
        verify(jwtService, never())
                .generateToken(anyString());


        // Cookie must NOT be created
        verify(httpServletResponse, never())
                .addHeader(
                        anyString(),
                        anyString()
                );
    }


    // =========================================================
    // LOGOUT
    // =========================================================

    @Test
    void logout_shouldLogoutSuccessfully() {

        ResponseEntity<?> response =
                authController.logout(
                        httpServletResponse
                );


        // =====================================================
        // STATUS
        // =====================================================

        assertEquals(
                HttpStatus.OK,
                response.getStatusCode()
        );


        // =====================================================
        // BODY
        // =====================================================

        assertNotNull(response.getBody());

        Map<?, ?> body =
                (Map<?, ?>) response.getBody();


        assertEquals(
                "Logout successful",
                body.get("message")
        );


        // =====================================================
        // VERIFY COOKIE REMOVAL
        // =====================================================

        verify(httpServletResponse)
                .addHeader(
                        eq(HttpHeaders.SET_COOKIE),
                        anyString()
                );
    }
}