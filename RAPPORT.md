# RAPPORT

## Rendu A

### Un problème, une solution
J'ai eu des soucis avec le timer qui s'affichait en NaN. Celà venait du fait que j'essayais d'ajouter 1 à "00:00" (qui n'est pas un nombre). Je devais à la place formater le nombre pour qu'il ressemble = mm:ss tout en conservant son format numérique, afin de pouvoir effectuer des opérations dessus.

### Usage de l'IA
- Formatage du timer
- Trouver un problème tout bête où il y avait juste le mot "type" qui était dans l'import alors qu'il ne devait pas être là
