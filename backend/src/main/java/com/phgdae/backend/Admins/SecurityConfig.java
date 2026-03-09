package com.phgdae.backend.Admins;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AdminRepository adminRepository;

    public SecurityConfig(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
                        .requestMatchers("/login/**", "/oauth2/**").permitAll()
                        .anyRequest().hasRole("ADMIN")
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(this.adminOAuth2UserService())
                        )
                        // ✅ Custom handler replaces defaultSuccessUrl to allow cross-origin redirect
                        .successHandler(customSuccessHandler())
                );

        return http.build();
    }

    // ✅ Allows redirect to React frontend on a different port after login
    @Bean
    public SimpleUrlAuthenticationSuccessHandler customSuccessHandler() {
        SimpleUrlAuthenticationSuccessHandler handler =
                new SimpleUrlAuthenticationSuccessHandler("http://localhost:5173/admin");

        DefaultRedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
        redirectStrategy.setContextRelative(false); // ✅ Critical: permits external URL redirects
        handler.setRedirectStrategy(redirectStrategy);

        return handler;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); // ✅ Required so session cookie travels with requests

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private OAuth2UserService<OAuth2UserRequest, OAuth2User> adminOAuth2UserService() {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

        return request -> {
            OAuth2User user = delegate.loadUser(request);
            String email = user.getAttribute("email");

            if (email != null && adminRepository.existsByEmail(email)) {
                List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("ROLE_ADMIN");
                return new DefaultOAuth2User(authorities, user.getAttributes(), "email");
            }

            throw new OAuth2AuthenticationException("Unauthorized: Your email is not registered as an Admin.");
        };
    }
}