package com.example.jk_samadhan_backend.services;

import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.jk_samadhan_backend.repositories.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDetails loadUserByUuid(UUID uuid) throws UsernameNotFoundException {
        return userRepository.findByUuid(uuid)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with UUID: " + uuid));
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        if (identifier == null) {
            throw new UsernameNotFoundException("Identifier cannot be null");
        }
        try {
            UUID uuid = UUID.fromString(identifier);
            return userRepository.findByUuid(uuid)
                    .orElseGet(() -> userRepository.findByIdentifier(identifier)
                            .orElseThrow(() -> new UsernameNotFoundException("User not found with identifier: " + identifier)));
        } catch (IllegalArgumentException e) {
            return userRepository.findByIdentifier(identifier)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with identifier: " + identifier));
        }
    }

}
