package com.example.jk_samadhan_backend.utils;

import java.util.Date;

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

    public String generateToken(String mobile) {
        return Jwts.builder()
                .setSubject(mobile)
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

    public boolean validateToken(String token, UserDetails userDetails) {

        return !getTokenDetails(token).getExpiration().before(new Date());
    }

    private Claims getTokenDetails(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

}
