1.design tokens (?)
  
    :root {
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    
    --navbar-height: 60px;
    --sidebar-width: 280px;
    --max-content-width: 1280px;
    }

2. layout primitives (utility classes)

    - container zentrierter wrapper mit max-width
    - stack vertikal mit konsistentem gap
    - cluster/row horizontal
    -sidebar (?)
    - grid (?)

3. page layout components

    -pagewrapper: vollbild container unter navbar
    -pageheader: konsistente seitenuebreschrift
    -pagecontent: hauptinhalt(scrollbar)?
    -pageactions: buttons 

    Design Tokens (CSS Variables)
Spacing
--spacing-xs (4px), --spacing-sm (8px), --spacing-md (16px), --spacing-lg (24px), --spacing-xl (32px), --spacing-2xl (48px)
Layout
--navbar-height (60px), --sidebar-width (280px), --max-content-width (1280px), --page-content-height (100vh - navbar)
Colors
--color-primary, --color-success, --color-danger, --color-warning, --color-muted --color-bg-primary, --color-bg-secondary, --color-bg-tertiary, --color-bg-elevated --color-text-primary, --color-text-secondary, --color-text-muted
Typography
--font-size-xs bis --font-size-4xl, --font-weight-normal/medium/semibold/bold
Borders & Shadows
--radius-sm/md/lg/xl/full, --shadow-sm/md/lg/xl, --shadow-focus
Utility-Klassen
Stack (Vertikal)
.stack - Flex column
.stack--xs/sm/md/lg/xl - Gap-Varianten
Row (Horizontal)
.row - Flex row, zentriert
.row--xs/sm/md/lg - Gap-Varianten
.row--start/center/end/between - Justify
.row--align-start/end/stretch - Align
Cluster (Horizontal mit Wrap)
.cluster - Flex wrap
.cluster--xs/sm/md/lg - Gap-Varianten
Container
.container - Max-width zentriert
.container--fluid/narrow/wide - Breiten-Varianten
Flex
.flex-1, .flex-auto, .flex-none - Flex-Werte
.flex-shrink-0, .flex-grow-0 - Shrink/Grow
.flex-scroll - Scrollbarer Flex-Child
.flex-center - Zentriert
Grid
.grid - Display grid
.grid--cols-2/3/4 - Spalten
.grid--auto-fit/fill - Responsive
.grid--gap-sm/md/lg - Gap
Spacing
.p-0/xs/sm/md/lg/xl - Padding all
.px-0/xs/sm/md/lg/xl - Padding horizontal
.py-0/xs/sm/md/lg/xl - Padding vertical
.m-0/auto/xs/sm/md/lg - Margin all
.mx-auto/xs/sm/md - Margin horizontal
.my-0/xs/sm/md/lg - Margin vertical
.mb-0/xs/sm/md/lg - Margin bottom
.mt-0/xs/sm/md/lg - Margin top
Display
.hidden, .block, .flex, .inline-flex
.overflow-hidden/auto, .overflow-y-auto
.relative, .absolute, .fixed, .sticky
.w-full, .h-full, .min-h-0
.sr-only - Screen reader only
Text
.text-left/center/right - Ausrichtung
.text-xs/sm/md/lg/xl/2xl - Größe
.font-normal/medium/semibold/bold - Gewicht
.text-primary/secondary/muted/success/danger - Farbe
.truncate - Einzeilig mit ...
.line-clamp-2/3 - Mehrzeilig mit ...
Layout-Klassen
Page
.pageWrapper - Fullscreen unter Navbar
.pageHeader - Seitenkopf
.pageHeader__title/subtitle/actions - Header-Elemente
.pageContent - Scrollbarer Inhalt
.pageContent--noPadding/centered - Varianten
.pageSection, .pageSection__title - Abschnitte
Two-Column
.twoColumn - Zwei-Spalten-Container
.twoColumn__left - Linke Spalte (1/3)
.twoColumn__right - Rechte Spalte (2/3)
.twoColumn--equal - 1:1 Verhältnis
.twoColumn--reversed - 2:1 Verhältnis
.twoColumn--withDivider - Mit Trennlinie
.twoColumn__scrollable - Scrollbarer Inhalt
.twoColumn__actionButton - Positionierter Button
Sidebar
.sidebarLayout - Sidebar-Container
.sidebarLayout__sidebar - Sidebar
.sidebarLayout__sidebar--collapsed - Eingeklappt
.sidebarLayout__main - Hauptinhalt
.sidebar__header/content/footer - Sidebar-Bereiche
Component-Klassen
Buttons
.btn - Basis-Button
.btn--primary/success/danger/secondary/ghost - Farb-Varianten
.btn--outline-primary/danger - Outline-Varianten
.btn--sm/lg - Größen
.btn--block - Volle Breite
.btn--icon - Icon-Only
Cards
.card - Basis-Card
.card--interactive - Klickbar
.card--flat - Ohne Shadow
.card__header/title/subtitle/body/footer/actions - Card-Bereiche
Forms
.form-group - Label + Input Container
.form-label, .form-label--required - Labels
.form-input/select/textarea - Eingabefelder
.form-input--error - Fehlerzustand
.form-hint, .form-error - Hilfetexte
.form-row - Horizontale Anordnung
.form-actions - Button-Leiste
Messages
.alert, .alert--success/error/warning/info - Alerts
.emptyState - Leerer Zustand
.loading - Ladezustand mit Spinner