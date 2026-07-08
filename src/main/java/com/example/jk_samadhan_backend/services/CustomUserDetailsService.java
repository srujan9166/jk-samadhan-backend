package com.example.jk_samadhan_backend.services;

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


    @Override
    public UserDetails loadUserByUsername(String mobile) throws UsernameNotFoundException {

            return userRepository.findByMobile(mobile)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + mobile));
      
        
    }

}
