package com.phgdae.backend.Admins;

import com.phgdae.backend.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminMeController {

    private final JwtUtil jwtUtil;

    public AdminMeController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(Map.of(
                "email", jwtUtil.getEmailFromToken(token),
                "name", jwtUtil.getNameFromToken(token),
                "picture", jwtUtil.getPictureFromToken(token),
                "role", jwtUtil.getRoleFromToken(token)
        ));
    }
}