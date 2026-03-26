package com.phgdae.backend.Admins;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler; 
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
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
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
                                .oidcUserService(this.adminOidcUserService())
                        )
                        .successHandler(customSuccessHandler())
                        .failureHandler(customFailureHandler()) 
                );

        return http.build();
    }

    @Bean
    public SimpleUrlAuthenticationSuccessHandler customSuccessHandler() {
        SimpleUrlAuthenticationSuccessHandler handler =
                new SimpleUrlAuthenticationSuccessHandler("http://localhost:5173/admin");
        DefaultRedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
        redirectStrategy.setContextRelative(false);
        handler.setRedirectStrategy(redirectStrategy);
        return handler;
    }

    // UPDATED BEAN: Corrected the route to match your frontend /admin/login path
    @Bean
    public SimpleUrlAuthenticationFailureHandler customFailureHandler() {
        return new SimpleUrlAuthenticationFailureHandler("http://localhost:5173/admin/login?error=no_privileges");
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private OAuth2UserService<OidcUserRequest, OidcUser> adminOidcUserService() {
        OidcUserService delegate = new OidcUserService();

        return request -> {
            OidcUser user = delegate.loadUser(request);
            String email = user.getAttribute("email");

            if (email == null) {
                throw new OAuth2AuthenticationException("Email not provided by Google.");
            }

            if (!adminRepository.existsByEmail(email)) {
                throw new OAuth2AuthenticationException("Access Denied: Admin email not registered.");
            }

            List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("ROLE_ADMIN");
            return new DefaultOidcUser(authorities, user.getIdToken(), user.getUserInfo());
        };
    }
}