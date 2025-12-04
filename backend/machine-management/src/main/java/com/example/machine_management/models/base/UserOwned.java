package com.example.machine_management.models.base;

public interface UserOwned {
    /**
     * Gibt die ID des besitzenden Users zurück.
     */
    Integer getUserId();
    
    /**
     * Setzt die ID des besitzenden Users.
     */
    void setUserId(Integer userId);
    
    /**
     * Prüft ob die Entity dem angegebenen User gehört.
     */
    default boolean isOwnedBy(Integer userId) {
        return getUserId() != null && getUserId().equals(userId);
    }
}