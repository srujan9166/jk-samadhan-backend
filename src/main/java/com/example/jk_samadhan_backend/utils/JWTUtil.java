package com.example.jk_samadhan_backend.utils;

import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Component
public class JWTUtil {

    private final String SECRET_KEY = "ajbdqyuwqjdbqwdqwdqwdqwdqwdqwdqwdqwdqwdqwdqwdqwdqwdqwdqwdqwdqwdqwdqwdqwd";

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    private final long expirationTime = 1000 * 60 * 60 * 60; // 1 hour in milliseconds

    public String generateTokenFromUuid(UUID uuid, String role) {
        return generateToken(uuid.toString(), role);
    }

    public String generateToken(String subject) {
        return generateToken(subject, "CITIZEN");
    }

    public String generateToken(String subject, String role) {
        return Jwts.builder()
                .setSubject(subject)
                .claim("role", role != null ? role : "CITIZEN")
                .signWith(key)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public UUID extractUuid(String token) {
        String subject = extractUsername(token);
        if (subject == null) {
            return null;
        }
        try {
            return UUID.fromString(subject);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public String extractRole(String token) {
        Object role = getTokenDetails(token).get("role");
        return role != null ? role.toString() : "CITIZEN";
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String subject = extractUsername(token);
        Claims claims = getTokenDetails(token);
        if (claims.getExpiration().before(new Date())) {
            return false;
        }
        if (userDetails instanceof com.example.jk_samadhan_backend.models.Users u) {
            boolean matchesSubject = (u.getUuid() != null && subject.equalsIgnoreCase(u.getUuid().toString()))
                || (u.getUsername() != null && subject.equalsIgnoreCase(u.getUsername()))
                || (u.getMobile() != null && subject.equalsIgnoreCase(u.getMobile()))
                || (u.getEmail() != null && subject.equalsIgnoreCase(u.getEmail()));

            if (!matchesSubject) {
                return false;
            }

            if (u.getUpdatedAt() != null && claims.getIssuedAt() != null) {
                long issuedAtSeconds = claims.getIssuedAt().getTime() / 1000;
                long updatedAtSeconds = u.getUpdatedAt().atZone(java.time.ZoneId.systemDefault()).toEpochSecond();
                if (updatedAtSeconds > (issuedAtSeconds + 2)) {
                    return false;
                }
            }

            return true;
        }
        return subject.equalsIgnoreCase(userDetails.getUsername());
    }

    public Claims getTokenDetails(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

}
