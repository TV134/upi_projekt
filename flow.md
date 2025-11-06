```mermaid
flowchart TD
    A[Početni ekran] --> B[Nastavi]
    B --> C{Odabir svijeta}
    C -->|Svijet brojeva| D[Mini igre: Brojanje, Zbrajanje, Uspoređivanje]
    C -->|Zemlja misli| E[Mini igre: Pamćenje, Prepoznavanje uzorka]
    D --> F[Ekran s pohvalama i bodovima]
    E --> F
    F --> G{Povratak}
    G -->|Ista kategorija| C1[Vrati u Svijet brojeva ili Zemlja misli]
    G -->|Odabir svijeta| C
    G -->|Početni ekran| A
