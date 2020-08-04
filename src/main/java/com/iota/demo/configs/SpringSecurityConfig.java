package com.iota.demo.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private AccessDeniedHandler accessDeniedHandler;

    @Autowired
    private CustomAuthenticationProvider customAuthProvider;

    private final AuthenticationSuccessHandler authenticationSuccessHandler;

    @Autowired
    public SpringSecurityConfig(AuthenticationSuccessHandler authenticationSuccessHandler) {
        this.authenticationSuccessHandler = authenticationSuccessHandler;
    }

    // roles admin allow to access /admin/**
    // roles user allow to access /user/**
    // custom 403 access denied handler
    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.csrf().disable()
                .authorizeRequests()
                .antMatchers( "/register", "/forgot", "/registerInsurance", "/registerService", "/h2", "/api/**").permitAll()
                .antMatchers("/js/**", "/css/**", "/fonts/**", "/images/**", "/img/**").permitAll()
                .antMatchers("/admin/**").hasRole("ADMIN")
                .antMatchers("/user/**").hasAnyRole("ROLE_USER")
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .loginPage("/login")
                .successHandler(authenticationSuccessHandler)
                .permitAll()
                .and()
                .logout()
                .permitAll()
                .and()
                .exceptionHandling().accessDeniedHandler(accessDeniedHandler)
                .and().headers()
                .frameOptions()
                .sameOrigin();;
    }

    // create two users, admin and user
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {

        auth.authenticationProvider(customAuthProvider);

        auth.inMemoryAuthentication()
                .withUser("user@thrivy.co.ke").password("{noop}password").roles("USER")
                .and()
                .withUser("admin@admin.co.ke").password("{noop}password").roles("ADMIN")
                .and()
                .withUser("db@thrivy.co.ke").password("{noop}password").roles("DB")
                .and()
                .withUser("greenhouse@voltarent.co.ke").password("{noop}password").roles("GH");;
    }

}
