```mermaid
flowchart TD
    A[Početni ekran] --> B{Odaberi svijet}
    B -->|Svijet brojeva| C[Mini igre: Brojanje, Zbrajanje, Uspoređivanje]
    B -->|Zemlja misli| D[Mini igre: Pamćenje, Prepoznavanje uzorka]
    C --> E[Ekran s pohvalama i bodovima]
    D --> E
    E --> A[Povratak na početni ekran]
