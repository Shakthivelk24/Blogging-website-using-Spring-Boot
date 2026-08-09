package com.BlogApplication.Controller;

import com.BlogApplication.model.User;
import com.BlogApplication.repository.UserRepository;
import com.BlogApplication.security.JwtService;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;
        private final JwtService jwtService;

        public AuthController(
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        AuthenticationManager authenticationManager,
                        JwtService jwtService) {

                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.authenticationManager = authenticationManager;
                this.jwtService = jwtService;
        }

        // =========================
        // REGISTER
        // =========================

        @PostMapping("/register")
        public ResponseEntity<?> register(
                        @RequestBody RegisterRequest request) {

                // Check username
                if (userRepository.existsByUsername(request.username())) {
                        return ResponseEntity.badRequest()
                                        .body(Map.of(
                                                        "message",
                                                        "Username already exists"));
                }

                // Check email
                if (userRepository.existsByEmail(request.email())) {
                        return ResponseEntity.badRequest()
                                        .body(Map.of(
                                                        "message",
                                                        "Email already exists"));
                }

                // Create user
                User user = User.builder()
                                .username(request.username())
                                .email(request.email())
                                .password(
                                                passwordEncoder.encode(
                                                                request.password()))
                                .role("USER")
                                .build();

                userRepository.save(user);

                return ResponseEntity.ok(
                                Map.of(
                                                "message",
                                                "Registration successful"));
        }

        // =========================
        // LOGIN
        // =========================

        @PostMapping("/login")
        public ResponseEntity<?> login(
                        @RequestBody LoginRequest request,
                        HttpServletResponse response) {

                System.out.println("Username received: " + request.username());
                System.out.println("Password received: " + request.password());

                try {

                        authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        request.username(),
                                                        request.password()));

                        System.out.println("Authentication SUCCESS");

                        String token = jwtService.generateToken(
                                        request.username());

                        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                                        .httpOnly(true)
                                        .secure(false)
                                        .path("/")
                                        .maxAge(Duration.ofHours(1))
                                        .sameSite("Lax")
                                        .build();

                        response.addHeader(
                                        HttpHeaders.SET_COOKIE,
                                        cookie.toString());

                        return ResponseEntity.ok(
                                        Map.of(
                                                        "message",
                                                        "Login successful"));

                } catch (Exception e) {

                        System.out.println("Authentication FAILED");
                        System.out.println("Exception: " + e.getClass().getName());
                        System.out.println("Message: " + e.getMessage());

                        return ResponseEntity
                                        .status(401)
                                        .body(
                                                        Map.of(
                                                                        "message",
                                                                        e.getClass().getSimpleName(),
                                                                        "error",
                                                                        String.valueOf(e.getMessage())));
                }
        }

        // =========================
        // LOGOUT
        // =========================

        @PostMapping("/logout")
        public ResponseEntity<?> logout(
                        HttpServletResponse response) {

                ResponseCookie cookie = ResponseCookie.from("jwt", "")
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(0)
                                .sameSite("Lax")
                                .build();

                response.addHeader(
                                HttpHeaders.SET_COOKIE,
                                cookie.toString());

                return ResponseEntity.ok(
                                Map.of(
                                                "message",
                                                "Logout successful"));
        }

        // =========================
        // REQUEST RECORDS
        // =========================

        public record RegisterRequest(
                        String username,
                        String email,
                        String password) {
        }

        public record LoginRequest(
                        String username,
                        String password) {
        }
}
