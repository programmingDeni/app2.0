package com.example.machine_management.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

import java.util.ArrayList;

/**
 * Factory class that creates a SecurityContext with a mocked UserPrincipal.
 * Used by the @WithMockUserPrincipal annotation.
 */
public class WithMockUserPrincipalSecurityContextFactory
        implements WithSecurityContextFactory<WithMockUserPrincipal> {

    @Override
    public SecurityContext createSecurityContext(WithMockUserPrincipal annotation) {
        // Create empty SecurityContext
        SecurityContext context = SecurityContextHolder.createEmptyContext();

        // Create UserPrincipal with userId and email from annotation
        UserPrincipal principal = new UserPrincipal(
                annotation.userId(),
                annotation.email()
        );

        // Create Authentication object with UserPrincipal
        Authentication auth = new UsernamePasswordAuthenticationToken(
                principal,           // principal (UserPrincipal)
                null,                // credentials (not needed for tests)
                new ArrayList<>()    // authorities (empty for now)
        );

        // Set authentication in context
        context.setAuthentication(auth);

        return context;
    }
}