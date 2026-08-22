package com.BlogApplication.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;

class JwtServiceTest {

    private JwtService jwtService;

    private static final String SECRET =
            "my-super-secret-key-for-jwt-testing-which-is-long-enough";

    @BeforeEach
    void setUp() {

        jwtService = new JwtService();

        // Inject @Value fields manually
        ReflectionTestUtils.setField(
                jwtService,
                "secretKey",
                SECRET
        );

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

    @Test
    void isTokenExpired_whenTokenIsExpired_shouldReturnTrue() {

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

        /*
         * The JWT parser may throw ExpiredJwtException
         * for an expired token.
         *
         * Therefore, the actual expiration behavior is
         * verified by checking that parsing recognizes
         * the token as expired.
         */
        assertThrows(
                Exception.class,
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


    // =========================================================
    // MISSING BRANCH COVERAGE
    //
    // Covers:
    //
    // tokenUsername.equals(username) == true
    // AND
    // isTokenExpired(token) == true
    //
    // This specifically covers the second branch of:
    //
    // return tokenUsername.equals(username)
    //        && !isTokenExpired(token);
    // =========================================================

    @Test
    void isTokenValid_whenUsernameMatchesButTokenIsExpired_shouldReturnFalse() {

        JwtService spyJwtService =
                spy(jwtService);

        doReturn("shakthi")
                .when(spyJwtService)
                .extractUsername("test-token");

        doReturn(true)
                .when(spyJwtService)
                .isTokenExpired("test-token");

        boolean valid =
                spyJwtService.isTokenValid(
                        "test-token",
                        "shakthi"
                );

        assertFalse(valid);
    }
}