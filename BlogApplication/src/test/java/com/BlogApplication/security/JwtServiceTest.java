package com.BlogApplication.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import io.jsonwebtoken.ExpiredJwtException;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    private static final String SECRET =
            "my-super-secret-key-for-jwt-testing-which-is-long-enough";


    @BeforeEach
    void setUp() {

        jwtService = new JwtService();

        // Inject @Value("${jwt.secret}")
        ReflectionTestUtils.setField(
                jwtService,
                "secretKey",
                SECRET
        );

        // Inject @Value("${jwt.expiration:3600000}")
        ReflectionTestUtils.setField(
                jwtService,
                "expiration",
                3600000L
        );
    }


    // =========================================================
    // GENERATE TOKEN
    // =========================================================

    @Test
    void generateToken_shouldGenerateValidToken() {

        String token =
                jwtService.generateToken("shakthi");

        assertNotNull(token);
        assertFalse(token.isBlank());
    }


    // =========================================================
    // EXTRACT USERNAME
    // =========================================================

    @Test
    void extractUsername_shouldReturnUsername() {

        String token =
                jwtService.generateToken("shakthi");

        String username =
                jwtService.extractUsername(token);

        assertEquals(
                "shakthi",
                username
        );
    }


    // =========================================================
    // TOKEN NOT EXPIRED
    // =========================================================

    @Test
    void isTokenExpired_whenTokenIsValid_shouldReturnFalse() {

        String token =
                jwtService.generateToken("shakthi");

        boolean expired =
                jwtService.isTokenExpired(token);

        assertFalse(expired);
    }


    // =========================================================
    // TOKEN VALID - CORRECT USERNAME
    // =========================================================

    @Test
    void isTokenValid_whenUsernameMatches_shouldReturnTrue() {

        String token =
                jwtService.generateToken("shakthi");

        boolean valid =
                jwtService.isTokenValid(
                        token,
                        "shakthi"
                );

        assertTrue(valid);
    }


    // =========================================================
    // TOKEN VALID - WRONG USERNAME
    // =========================================================

    @Test
    void isTokenValid_whenUsernameDoesNotMatch_shouldReturnFalse() {

        String token =
                jwtService.generateToken("shakthi");

        boolean valid =
                jwtService.isTokenValid(
                        token,
                        "otherUser"
                );

        assertFalse(valid);
    }


    // =========================================================
    // TOKEN VALID - INVALID TOKEN
    // =========================================================

    @Test
    void isTokenValid_whenTokenIsInvalid_shouldReturnFalse() {

        String invalidToken =
                "this-is-not-a-valid-jwt-token";

        boolean valid =
                jwtService.isTokenValid(
                        invalidToken,
                        "shakthi"
                );

        assertFalse(valid);
    }


    // =========================================================
    // TOKEN EXPIRED
    // =========================================================
    //
    // IMPORTANT:
    // JJWT throws ExpiredJwtException while parsing an
    // expired token. Therefore this method should NOT
    // assertTrue().
    //
    // =========================================================

    @Test
    void isTokenExpired_whenTokenIsExpired_shouldThrowException() {

        JwtService expiredJwtService =
                new JwtService();

        ReflectionTestUtils.setField(
                expiredJwtService,
                "secretKey",
                SECRET
        );

        ReflectionTestUtils.setField(
                expiredJwtService,
                "expiration",
                -1000L
        );

        String token =
                expiredJwtService.generateToken(
                        "shakthi"
                );

        assertThrows(
                ExpiredJwtException.class,
                () -> expiredJwtService.isTokenExpired(token)
        );
    }


    // =========================================================
    // EXPIRED TOKEN SHOULD BE INVALID
    // =========================================================

    @Test
    void isTokenValid_whenTokenIsExpired_shouldReturnFalse() {

        JwtService expiredJwtService =
                new JwtService();

        ReflectionTestUtils.setField(
                expiredJwtService,
                "secretKey",
                SECRET
        );

        ReflectionTestUtils.setField(
                expiredJwtService,
                "expiration",
                -1000L
        );

        String token =
                expiredJwtService.generateToken(
                        "shakthi"
                );

        boolean valid =
                expiredJwtService.isTokenValid(
                        token,
                        "shakthi"
                );

        assertFalse(valid);
    }


    // =========================================================
    // INVALID TOKEN FOR EXTRACT USERNAME
    // =========================================================

    @Test
    void extractUsername_whenTokenIsInvalid_shouldThrowException() {

        assertThrows(
                Exception.class,
                () -> jwtService.extractUsername(
                        "invalid-token"
                )
        );
    }
}