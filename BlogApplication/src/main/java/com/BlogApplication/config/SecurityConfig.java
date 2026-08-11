package com.BlogApplication.config;

import com.BlogApplication.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // =========================
            // CORS
            // =========================

            .cors(cors ->
                    cors.configurationSource(
                            corsConfigurationSource()
                    )
            )


            // =========================
            // CSRF
            // =========================

            .csrf(csrf -> csrf.disable())


            // =========================
            // STATELESS JWT
            // =========================

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )


            // =========================
            // AUTHORIZATION
            // =========================

            .authorizeHttpRequests(auth -> auth

                    // Login / Register / Logout
                    .requestMatchers(
                            "/api/auth/**"
                    ).permitAll()


                    // My Posts
                    // MUST COME BEFORE /api/posts/**
                    .requestMatchers(
                            "/api/posts/user"
                    ).authenticated()


                    // View posts
                    // PUBLIC
                    .requestMatchers(
                            HttpMethod.GET,
                            "/api/posts/**"
                    ).permitAll()


                    // Current user
                    .requestMatchers(
                            "/api/user/current"
                    ).authenticated()


                    // Create
                    .requestMatchers(
                            HttpMethod.POST,
                            "/api/posts/**"
                    ).authenticated()


                    // Update
                    .requestMatchers(
                            HttpMethod.PUT,
                            "/api/posts/**"
                    ).authenticated()


                    // Delete
                    .requestMatchers(
                            HttpMethod.DELETE,
                            "/api/posts/**"
                    ).authenticated()


                    // Public
                    .requestMatchers(
                            "/",
                            "/error"
                    ).permitAll()


                    // Everything else
                    .anyRequest().authenticated()
            )


            // =========================
            // JWT FILTER
            // =========================

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );


        return http.build();
    }


    // =========================
    // PASSWORD ENCODER
    // =========================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // =========================
    // AUTHENTICATION MANAGER
    // =========================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration
                .getAuthenticationManager();
    }


    // =========================
    // CORS CONFIGURATION
    // =========================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}