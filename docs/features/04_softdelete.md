Feature Request: Soft Delete Implementation
Status: 🔴 Not Implemented (Feature Request)
Priorität: Medium
Created: 2025-11-03
Problem / Aktuelle Situation
Was geht aktuell NICHT?
User löschen ist unmöglich, sobald sie irgendwelche Objekte erstellt haben:
-- User 1 (admin@example.com) hat Machines erstellt
-- Versuch den User zu löschen:
DELETE FROM "user" WHERE id = 1;

-- ❌ FEHLER:
-- ERROR: update or delete on table "user" violates foreign key constraint
-- "fk_machine_created_by" on table "machine"
-- DETAIL: Key (id)=(1) is still referenced from table "machine"
Machines löschen ist unmöglich, sobald sie AttributeValues haben:
-- Machine 5 hat AttributeValues
-- Versuch die Machine zu löschen:
DELETE FROM machine WHERE id = 5;

-- ❌ FEHLER:
-- ERROR: violates foreign key constraint "fk_attribute_value_machine"
Warum ist das ein Problem?
Keine DSGVO-Compliance: User können nicht gelöscht werden (Right to be forgotten)
Keine Datenpflege: Alte Machines/Templates können nicht aufgeräumt werden
Workaround erforderlich: Aktuell muss man ALLE referenzierten Objekte manuell vorher löschen (fehleranfällig!)
Root Cause
V4 und V5 Migrationen haben Foreign Key Constraints mit ON DELETE RESTRICT hinzugefügt:
-- V4\_\_add_foreign_keys.sql
ALTER TABLE machine
ADD CONSTRAINT fk_machine_created_by
FOREIGN KEY (created_by) REFERENCES "user"(id);
-- Kein ON DELETE = RESTRICT (verhindert Löschen)

-- V5\_\_fix_user_audit_constraints.sql  
ALTER TABLE "user"
ADD CONSTRAINT fk_user_created_by_self
FOREIGN KEY (created_by) REFERENCES "user"(id);
Aktuelle Cascade-Optionen sind alle schlecht:
❌ RESTRICT (aktuell): Löschen unmöglich
❌ CASCADE: Löscht ALLE Daten des Users (zu gefährlich)
❌ SET NULL: Verliert Audit-Information, funktioniert nicht mit NOT NULL Spalten
Lösung: Soft Delete Pattern
Was ist Soft Delete?
Statt Zeilen aus der DB zu löschen (Hard Delete), markieren wir sie nur als "gelöscht" (Soft Delete):
// User.java, Machine.java, etc.
@Column(name = "deleted_at")
private LocalDateTime deletedAt;

public boolean isDeleted() {
return deletedAt != null;
}
-- Statt DELETE:
UPDATE "user" SET deleted_at = NOW() WHERE id = 1;

-- User ist jetzt "unsichtbar" für normale Queries:
SELECT \* FROM "user" WHERE deleted_at IS NULL;
Vorteile
✅ User/Machines können "gelöscht" werden ohne Foreign Key Probleme
✅ Audit Trail bleibt erhalten: Wer hat was erstellt/geändert
✅ DSGVO-konform: User sind "unsichtbar" aber Daten bleiben für Audit
✅ Wiederherstellbar: UPDATE user SET deleted_at = NULL reaktiviert User
✅ Keine Cascade-Probleme: Alle Referenzen bleiben intakt
Nachteile
⚠️ Mehr Code: Filter WHERE deleted_at IS NULL in allen Queries
⚠️ Unique Constraints komplizierter: Email muss unique sein unter nicht-gelöschten Users
⚠️ DB wächst: Gelöschte Daten bleiben in der DB (können später archiviert werden)
Technisches Design

1. Migration: V6\_\_add_soft_delete.sql
   -- Add deleted_at to all auditable tables
   ALTER TABLE "user" ADD COLUMN deleted_at TIMESTAMP;
   ALTER TABLE machine ADD COLUMN deleted_at TIMESTAMP;
   ALTER TABLE machine_template ADD COLUMN deleted_at TIMESTAMP;
   ALTER TABLE machine_attribute ADD COLUMN deleted_at TIMESTAMP;
   ALTER TABLE attribute_value ADD COLUMN deleted_at TIMESTAMP;
   ALTER TABLE template_attribute ADD COLUMN deleted_at TIMESTAMP;

-- Create index for performance (filtering deleted records)
CREATE INDEX idx_user_deleted_at ON "user"(deleted_at);
CREATE INDEX idx_machine_deleted_at ON machine(deleted_at);
CREATE INDEX idx_machine_template_deleted_at ON machine_template(deleted_at);

-- Fix unique constraint for email (only active users)
ALTER TABLE "user" DROP CONSTRAINT user_email_key;
CREATE UNIQUE INDEX user_email_active_unique
ON "user"(email) WHERE deleted_at IS NULL; 2. Entity Updates
// AuditableEntity.java
@MappedSuperclass
@Getter
@EntityListeners(AuditingEntityListener.class)
public abstract class AuditableEntity {
// ... existing audit fields ...

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public boolean isDeleted() {
        return deletedAt != null;
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    public void restore() {
        this.deletedAt = null;
    }

} 3. Repository Filter
// Add to all repositories
@Query("SELECT e FROM User e WHERE e.deletedAt IS NULL")
List<User> findAll();

@Query("SELECT e FROM User e WHERE e.id = :id AND e.deletedAt IS NULL")
Optional<User> findById(@Param("id") Integer id);

// Oder: @Where(clause = "deleted_at IS NULL") auf Entity-Ebene 4. Service Layer
// UserService.java
public void deleteUser(Integer id) {
User user = userRepository.findById(id)
.orElseThrow(() -> new NotFoundException("User not found"));
user.softDelete();
userRepository.save(user);
}

public void restoreUser(Integer id) {
// Auch gelöschte Users finden:
User user = userRepository.findByIdIncludingDeleted(id)
.orElseThrow(() -> new NotFoundException("User not found"));
user.restore();
userRepository.save(user);
}
Implementierungsplan
Phase 1: User Soft Delete
V6 Migration: deleted_at Spalte für User
AuditableEntity erweitern
UserRepository Queries anpassen
UserService deleteUser() / restoreUser() implementieren
Tests schreiben
Phase 2: Cascade auf andere Entities
Machine, MachineTemplate, MachineAttribute
AttributeValue, TemplateAttribute
Repositories anpassen
Services anpassen
Phase 3: Frontend Integration
"Delete" Button → Soft Delete API Call
"Restore" Button für Admins (optional)
Gelöschte Objekte ausblenden in Lists
Phase 4: Cleanup Job (Optional)
Scheduled Job: Permanent löschen nach X Monaten
Admin Panel: Manuelle Cleanup-Funktion
Open Questions
Wie lange Soft-Deleted Daten aufbewahren?
Vorschlag: 90 Tage, dann permanent löschen
Cascade beim Soft Delete?
Wenn User gelöscht wird, auch alle seine Machines soft-deleten?
Oder: Nur User löschen, Machines bleiben sichtbar?
DSGVO: Reicht Soft Delete?
Möglicherweise müssen persönliche Daten (Email, Name) wirklich gelöscht werden
Lösung: anonymize() Methode zusätzlich zu softDelete()
Related
V4**add_foreign_keys.sql - Warum Foreign Keys User-Löschen verhindern
V5**fix_user_audit_constraints.sql - User-Tabelle Audit Constraints
Spring Data JPA @Where annotation
