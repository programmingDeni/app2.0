Backend
1️.  Models erweitern, welche models? attribute value 
    1.1.: pruefungsInterval, zuletztGeprueft und zuletztGetauscht 
    AttributeValue
    DONE
2️.   DTOs erweitern DONE
3.  Mapper updaten DONE
4.  Service/Controller ergänzen DONE

Frontend
1.  API-Response anpassen (Daten empfangen)
    1.1. muss in MachineAttributeValuesView machineattributes und attributevalues laden
    1.2. sollte ueber jquery laufen, ist noch ueber presenter 
    1.3. fuer machineattribute jquery geschrieben, fuer attributevalues noch zu tun 
    1.4. backend anpassungen noetig fuer eager und lazy loading der verschachtelten objekte (machineAttributes, attribtueValues)
2.  UI-Elemente anpassen
3.  Optional: Bearbeiten/Updaten ermöglichen

Planung MachineValuesView update:

📋 UI/UX-Verbesserungen für Prüfungsintervalle
🎯 Problem
Aktuelle Jahr-Spalten (2021, 2022, 2023...) werden unübersichtlich bei unterschiedlichen Intervallen
Unklar, welche Prüfungen überfällig sind oder bald anstehen
Keine automatische Berechnung der nächsten Prüftermine
✅ Lösung: Status-orientierter Ansatz
Best Practice aus professionellen CMMS/ERP-Systemen (SAP, MaintainX, Limble)
📊 Neue Tabellenstruktur
Spalten:
Attributname - wie bisher
Typ - wie bisher
Status ⭐ NEU - Farbcodierte Badge:
🔴 ÜBERFÄLLIG (Rot)
🟡 BALD FÄLLIG (Gelb)
🟢 AKTUELL (Grün)
⚪ KEINE DATEN (Grau)
Nächste Prüfung ⭐ NEU - Berechnetes Datum (z.B. "15. Jan 2025" oder "in 5 Tagen")
Intervall - wie bisher (als Chip: "30 Tage", "90 Tage", etc.)
Letzte Prüfung ⭐ NEU - Zeigt zuletztGeprueft Datum
Aktionen - Quick-Actions Menü
Entfernt: Jahr-Spalten (2021, 2022, 2023...)
📖 Ausklappbare Zeilen für Historie
Statt Jahr-Spalten: Chevron-Icon zum Ausklappen
Zeigt vollständige Prüfungshistorie aller Jahre
Timeline-Darstellung mit Werten pro Jahr
Zusatzinfos: zuletztGeprueft, zuletztGetauscht
Quick-Actions: "Prüfung planen", "Bericht herunterladen"
Vorteil: Haupttabelle bleibt übersichtlich, Details auf Klick verfügbar
🔧 Backend-Erweiterungen
MachineAttributeDto neue Felder:
nextInspectionDate - Berechnet: zuletztGeprueft + pruefungsIntervall
inspectionStatus - Enum: OVERDUE, DUE_SOON, CURRENT, UNKNOWN
daysUntilDue - Für relative Anzeige ("in 5 Tagen", "-15 Tage")
Service-Logik:
Automatische Berechnung des nächsten Prüftermins
Status-Ermittlung basierend auf Fristablauf
Warnschwelle: 14 Tage vor Ablauf = "BALD FÄLLIG"
Neuer Endpoint:
POST /api/machines/{id}/attributes/{id}/mark-inspected - Prüfung als erledigt markieren
🎨 Frontend-Komponenten
Neue Components:
InspectionStatusBadge - Farbcodierte Status-Chips mit Icon
IntervalChip - Kleine Chips für Intervall-Anzeige
AttributeValueHistoryRow - Ausgeklappter Bereich mit Timeline
AttributeActionsMenu - Dropdown mit Quick-Actions
MachinenAttributValuesTableUI Änderungen:
Neue Spalten hinzufügen (Status, Nächste Prüfung, Letzte Prüfung)
Jahr-Spalten entfernen
DataGrid Master-Detail für ausklappbare Zeilen
🎨 Farbkodierung (WCAG AA konform)
Überfällig: Rot (Hintergrund hell, Text dunkel)
Bald fällig: Gelb/Amber
Aktuell: Grün
Keine Daten: Grau
🚀 Umsetzungsphasen
Phase 1: Backend-Grundlage (Must-Have)
InspectionStatus Enum erstellen
MachineAttributeDto erweitern
Berechnungslogik implementieren
Mapper aktualisieren
Phase 2: Frontend-Spalten (Must-Have)
TypeScript Interfaces erweitern
Status-Badge Component erstellen
Spalten-Konfiguration anpassen
Jahr-Spalten entfernen, neue Spalten hinzufügen
Phase 3: Expandable Rows (Should-Have)
History Component mit Timeline
MUI DataGrid Master-Detail Integration
Quick-Actions im ausgeklappten Bereich
Phase 4: Zusatzfunktionen (Nice-to-Have)
"Prüfung abgeschlossen" Button
Kalender-Ansicht
Filter & Sortierung nach Status
Email-Benachrichtigungen bei Überfälligkeit
PDF-Export
✅ Vorteile
Für Benutzer:
Sofort erkennbar: Was ist überfällig? (rote Badges)
Klare Deadlines: Wann ist die nächste Prüfung?
Übersichtlich: Hauptinfo prominent, Details auf Klick
Funktioniert für alle Intervalle (30 Tage bis 2 Jahre)
Technisch:
Automatische Berechnung (keine manuelle Ermittlung)
Skaliert auf beliebig viele Attribute
Wiederverwendbare Components
Folgt Industry Standards (CMMS Best Practices)
📚 Referenzen
Professionelle Systeme mit ähnlichem Ansatz:
SAP Quality Management (QM)
MaintainX CMMS
Limble CMMS
WorkTrek
ThingsBoard, Grafana (IoT Dashboards)
