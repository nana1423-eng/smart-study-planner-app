package com.smartstudy.planner.user;

import com.smartstudy.planner.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final VerificationTokenRepository tokenRepository;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                          PasswordEncoder encoder, JwtUtil jwtUtil, 
                          VerificationTokenRepository tokenRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
        this.tokenRepository = tokenRepository;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);
            
            User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

            return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getUsername(), user.getFullName(), user.getEmail(), 
                    user.getRole() != null ? user.getRole().name() : "USER", user.isEmailVerified()));
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).body("Error: Invalid username or password");
        }
    }

    @PostMapping("/signup")
    @Transactional
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        // Backend Regex Protection
        if (signUpRequest.getEmail() == null || !signUpRequest.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            return ResponseEntity.badRequest().body("Error: Invalid email format!");
        }

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setFullName(signUpRequest.getFullName());
        user.setEmail(signUpRequest.getEmail());
        user.setPasswordHash(encoder.encode(signUpRequest.getPassword()));
        user.setRole(Role.USER);
        user.setEmailVerified(true);
        userRepository.save(user);

        // OTP Generation logic (Disabled since user is auto-verified)
        // String otp = String.format("%06d", new Random().nextInt(999999));
        // Native Dispatch
        // emailService.sendOtpEmail(user.getEmail(), otp);

        return ResponseEntity.ok("User registered successfully.");
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/verify-email")
    @Transactional
    public ResponseEntity<?> verifyEmail(@RequestBody VerifyEmailRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: User not found!");
        }

        User user = userOpt.get();
        if (user.isEmailVerified()) {
            return ResponseEntity.badRequest().body("Error: Email is already verified!");
        }

        Optional<VerificationToken> tokenOpt = tokenRepository.findByUser(user);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: No pending verification found.");
        }

        VerificationToken token = tokenOpt.get();
        if (token.isExpired()) {
            tokenRepository.deleteByUser(user);
            return ResponseEntity.badRequest().body("Error: Token expired. Please request a new one.");
        }

        if (!token.getToken().equals(request.getOtp())) {
            return ResponseEntity.badRequest().body("Error: Invalid OTP code.");
        }

        // Lock in Verification
        user.setEmailVerified(true);
        userRepository.save(user);
        tokenRepository.deleteByUser(user);

        return ResponseEntity.ok("Email successfully verified!");
    }
}
