package com.BlogApplication.Controller;

import org.junit.jupiter.api.Test;

import org.springframework.security.core.Authentication;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserControllerTest {

    @Test
    void getCurrentUser_shouldReturnUsername() {

        // Arrange
        UserController userController =
                new UserController();

        Authentication authentication =
                mock(Authentication.class);

        when(authentication.getName())
                .thenReturn("shakthi");


        // Act
        Map<String, String> result =
                userController.getCurrentUser(authentication);


        // Assert
        assertEquals(
                "shakthi",
                result.get("username")
        );
    }
}
