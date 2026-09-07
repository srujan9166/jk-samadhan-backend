package com.example.jk_samadhan_backend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.jk_samadhan_backend.filter.JwtFilter;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableMethodSecurity
public class SecurityConfiguration {
    private final JwtFilter jwtFilter;

    public SecurityConfiguration(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(request -> {
                    org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowedOrigins(java.util.List.of(
                        "http://localhost:5173",
                        "http://localhost:5174",
                        "http://localhost:3000",
                        "http://127.0.0.1:5173",
                        "http://127.0.0.1:5174"
                    ));
                    config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(java.util.List.of("*"));
                    config.setExposedHeaders(java.util.List.of("Content-Disposition", "content-disposition"));
                    config.setAllowCredentials(true);
                    return config;
                }))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/login", "/auth/signup", "/auth/forgot-password", "/auth/captcha",
                                         "/api/auth/login", "/api/auth/signup", "/api/auth/forgot-password", "/api/auth/captcha",
                                         "/api/geo/**", "/api/v1/masters/**", "/api/masters/**", "/api/announcements/**", "/error").permitAll()
                        .requestMatchers("/auth/change-password", "/api/auth/change-password").authenticated()
                        .requestMatchers("/api/super-admin/**", "/api/superadmin/**").hasAnyAuthority("ROLE_SuperAdmin", "SUPERADMIN", "ROLE_SUPER_ADMIN", "SUPER_ADMIN")
                        .requestMatchers("/api/admin/**").hasAnyAuthority("ROLE_SuperAdmin", "ROLE_Admin", "SUPERADMIN", "ADMIN")
                        .requestMatchers("/api/dept/**").hasAnyAuthority("ROLE_Department", "DEPARTMENT")
                        .requestMatchers("/api/dm/**").hasAnyAuthority("ROLE_DM", "DM")
                        .requestMatchers("/api/appellate/**").hasAnyAuthority("ROLE_Appellate", "APPELLATE")
                        .requestMatchers("/api/dealingHand/**").hasAnyAuthority("ROLE_DealingHand", "DEALING_HAND")
                        .requestMatchers("/api/user/**", "/api/users/**", "/api/grievances/**", "/api/dashboard/**", "/api/appeals/**").authenticated()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();

    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(PasswordEncoder passwordEncoder,
            UserDetailsService userDetailsService) throws Exception {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(authProvider);

    }

}
