package com.BlogApplication.Controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/current")
    public Map<String, String> getCurrentUser(
            Authentication authentication) {

        return Map.of(
                "username",
                authentication.getName()
        );
    }
}