package com.example.machine_management.security;

import org.springframework.security.test.context.support.WithSecurityContext;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * Custom annotation to mock a UserPrincipal in tests.
 *
 * Usage:
 * @Test
 * @WithMockUserPrincipal(userId = 1, email = "test@example.com")
 * void testSomething() {
 *     // SecurityUtils.getCurrentUserId() returns 1
 * }
 */
@Retention(RetentionPolicy.RUNTIME)
@WithSecurityContext(factory = WithMockUserPrincipalSecurityContextFactory.class)
public @interface WithMockUserPrincipal {

    /**
     * The userId to use in the UserPrincipal.
     * Default: 1
     */
    int userId() default 1;

    /**
     * The email to use in the UserPrincipal.
     * Default: "test@example.com"
     */
    String email() default "test@example.com";
}
