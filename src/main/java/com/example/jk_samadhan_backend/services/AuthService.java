package com.example.jk_samadhan_backend.services;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.jk_samadhan_backend.dto.ForgotPasswordDTO;
import com.example.jk_samadhan_backend.dto.LoginDTO;
import com.example.jk_samadhan_backend.dto.RegisterDTO;
import com.example.jk_samadhan_backend.models.Users;
import com.example.jk_samadhan_backend.repositories.UserRepository;
import com.example.jk_samadhan_backend.utils.JWTUtil;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager AuthenticationManager;
    private final JWTUtil jwtUtil;
    private final CaptchaService captchaService;
    private final com.example.jk_samadhan_backend.repositories.UserTypeRepository userTypeRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            AuthenticationManager AuthenticationManager, JWTUtil jwtUtil, CaptchaService captchaService,
            com.example.jk_samadhan_backend.repositories.UserTypeRepository userTypeRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.AuthenticationManager = AuthenticationManager;
        this.jwtUtil = jwtUtil;
        this.captchaService = captchaService;
        this.userTypeRepository = userTypeRepository;
    }

    private String generateRandomPassword() {
        String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lower = "abcdefghijklmnopqrstuvwxyz";
        String digits = "0123456789";
        String all = upper + lower + digits;
        java.security.SecureRandom random = new java.security.SecureRandom();
        StringBuilder password = new StringBuilder();

        password.append(upper.charAt(random.nextInt(upper.length())));
        password.append(lower.charAt(random.nextInt(lower.length())));
        password.append(digits.charAt(random.nextInt(digits.length())));

        for (int i = 3; i < 8; i++) {
            password.append(all.charAt(random.nextInt(all.length())));
        }

        char[] array = password.toString().toCharArray();
        for (int i = array.length - 1; i > 0; i--) {
            int index = random.nextInt(i + 1);
            char temp = array[index];
            array[index] = array[i];
            array[i] = temp;
        }
        return new String(array);
    }

    public Map<String, String> signup(RegisterDTO registerDTO) throws Exception {

        if (!captchaService.validateCaptcha(registerDTO.getCaptchaId(), registerDTO.getCaptchaCode())) {
            throw new RuntimeException("Invalid or expired CAPTCHA code");
        }

        String email = registerDTO.getEmail();
        if (email != null && email.trim().isEmpty()) {
            email = null;
        }

        if (email != null && userRepository.existsByEmail(email)) {
            throw new RuntimeException("User already exists with this email");
        }
        if (userRepository.existsByMobile(registerDTO.getMobile())) {
            throw new RuntimeException("User already exists with this mobile number");
        }

        String username = registerDTO.getUsername();
        if (username == null || username.trim().isEmpty()) {
            username = registerDTO.getMobile();
        }
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("User already exists with this username");
        }

        String rawPassword = generateRandomPassword();

        Users user = new Users();
        user.setUuid(java.util.UUID.randomUUID());
        user.setUserType(userTypeRepository.findById(10).orElseThrow(() -> new RuntimeException("Default UserType not found")));
        user.setFirstName(registerDTO.getFirstName());
        user.setMiddleName(registerDTO.getMiddleName());
        user.setLastName(registerDTO.getLastName());
        user.setUsername(username);
        user.setDateOfBirth(registerDTO.getDateOfBirth());
        user.setGender(registerDTO.getGender());
        user.setEmail(email);
        user.setMobile(registerDTO.getMobile());
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole("CITIZEN");
        user.setCreatedAt(LocalDateTime.now().toString());
        user.setAddress(registerDTO.getAddress());
        user.setPincode(registerDTO.getPincode());
        user.setState(registerDTO.getState());
        user.setDistrict(registerDTO.getDistrict());
        userRepository.save(user);

        System.out.println("\n==================================================");
        System.out.println("NEW USER REGISTERED SUCCESSFULLY!");
        System.out.println("User ID (Mobile): " + user.getMobile());
        System.out.println("Generated Password: " + rawPassword);
        System.out.println("==================================================\n");

        Map<String, String> response = new HashMap<>();
        response.put("userId", user.getMobile());
        response.put("message", "Registration is Done.");
        return response;

    }

    public Map<String, Object> login(LoginDTO loginDTO) {

        Users user = userRepository.findByMobile(loginDTO.getMobile())
                .orElseThrow(() -> new RuntimeException("User not found with mobile: " + loginDTO.getMobile()));

        AuthenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginDTO.getMobile(), loginDTO.getPassword()));

        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            if (loginDTO.getOtpCode() == null || loginDTO.getOtpCode().trim().isEmpty()) {
                System.out.println("\n==================================================");
                System.out.println("MOCK OTP SENT SUCCESSFULLY!");
                System.out.println("User ID (Mobile): " + loginDTO.getMobile());
                System.out.println("Mock OTP: 123456");
                System.out.println("==================================================\n");

                Map<String, Object> response = new HashMap<>();
                response.put("status", "OTP_REQUIRED");
                response.put("message", "Credentials verified. Mock OTP sent.");
                return response;
            }

            if (!"123456".equals(loginDTO.getOtpCode().trim())) {
                throw new RuntimeException("Invalid OTP code");
            }
        }

        String token = jwtUtil.generateToken(loginDTO.getMobile());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("status", "SUCCESS");

        Map<String, String> userProfile = new HashMap<>();
        String fullName = user.getFirstName() + " " +
                (user.getMiddleName() != null && !user.getMiddleName().trim().isEmpty()
                        ? user.getMiddleName().trim() + " "
                        : "")
                +
                user.getLastName();
        userProfile.put("name", fullName.trim());
        userProfile.put("email", user.getEmail() != null ? user.getEmail() : "");
        userProfile.put("phone", user.getMobile());
        userProfile.put("district", user.getDistrict() != null ? user.getDistrict() : "");
        userProfile.put("address", user.getAddress() != null ? user.getAddress() : "");
        userProfile.put("role", user.getRole().toLowerCase());

        response.put("user", userProfile);
        return response;

    }

    public String forgotPassword(ForgotPasswordDTO forgotPasswordDTO) {

        Users user = userRepository.findByMobile(forgotPasswordDTO.getMobile())
                .orElseThrow(() -> new RuntimeException(
                        "User not found with mobile number: " + forgotPasswordDTO.getMobile()));
        if (!forgotPasswordDTO.getPassword().equals(forgotPasswordDTO.getConfirmPassword())) {
            throw new RuntimeException("Password and Confirm Password do not match");
        }
        user.setPassword(passwordEncoder.encode(forgotPasswordDTO.getPassword()));
        userRepository.save(user);
        return "Password updated successfully";

    }

}
