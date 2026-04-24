package com.phgdae.backend.Admins;

import com.phgdae.backend.enums.AdminRole;
import com.phgdae.backend.security.JwtAuthenticationFilter;
import com.phgdae.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    @Value("${BACKEND_URL:http://localhost:8080}")
    private String backendUrl;

    public SecurityConfig(AdminRepository adminRepository, JwtUtil jwtUtil, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.adminRepository = adminRepository;
        this.jwtUtil = jwtUtil;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
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
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/suggestions").permitAll()
                        .requestMatchers("/login/**", "/oauth2/**").permitAll()
                        .requestMatchers("/api/admin/add", "/api/admin/remove/**", "/api/admin/all").hasRole("SUPER_ADMIN")
                        .anyRequest().hasRole("ADMIN")
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .oidcUserService(this.adminOidcUserService())
                        )
                        .redirectionEndpoint(redirection -> redirection
                                .baseUri("/login/oauth2/code/*")
                        )
                        .successHandler(customSuccessHandler())
                        .failureHandler(customFailureHandler())
                );

        return http.build();
    }

    @Bean
    public SimpleUrlAuthenticationSuccessHandler customSuccessHandler() {
        return new SimpleUrlAuthenticationSuccessHandler() {
            @Override
            protected String determineTargetUrl(jakarta.servlet.http.HttpServletRequest request,
                                                jakarta.servlet.http.HttpServletResponse response,
                                                org.springframework.security.core.Authentication authentication) {

                OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
                String email = oidcUser.getEmail();
                String name = oidcUser.getFullName();
                String picture = oidcUser.getAttribute("picture");
                
                boolean isSuperAdmin = authentication.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN"));

                String role;
                String targetPath;

                if (isSuperAdmin) {
                    role = "ROLE_SUPER_ADMIN";
                    targetPath = "/superadmin";
                } else {
                    role = "ROLE_MANAGER";
                    targetPath = "/admin";
                }

                String token = jwtUtil.generateToken(email, role, name, picture != null ? picture : "");

                return frontendUrl + targetPath + "?token=" + token;
            }
        };
    }

    @Bean
    public SimpleUrlAuthenticationFailureHandler customFailureHandler() {
        return new SimpleUrlAuthenticationFailureHandler(frontendUrl + "/admin/login?error=no_privileges");
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(frontendUrl.split(",")));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
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

            Admin admin = adminRepository.findByEmail(email)
                    .orElseThrow(() -> new OAuth2AuthenticationException("Access Denied: Admin email not registered."));

            String springRole = (admin.getRole() == AdminRole.SUPER_ADMIN) ? "ROLE_SUPER_ADMIN" : "ROLE_MANAGER";
            
            List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("ROLE_ADMIN", springRole);

            return new DefaultOidcUser(authorities, user.getIdToken(), user.getUserInfo());
        };
    }
}