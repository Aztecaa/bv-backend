-- Restaura el índice único sobre "slug" en la tabla "Car".
-- Se había eliminado en una migración anterior (20260521084234_expand_car_model)
-- y nunca se volvió a crear, aunque schema.prisma sigue declarando @unique.
--
-- Antes de aplicar esto, si sospechás que hay slugs duplicados (por ejemplo por
-- el auto que se duplicó manualmente), revisá con:
--   SELECT slug, COUNT(*) FROM "Car" WHERE slug IS NOT NULL GROUP BY slug HAVING COUNT(*) > 1;
-- y corregí/borrá los duplicados antes de correr esta migración, o la creación
-- del índice único va a fallar.

CREATE UNIQUE INDEX "Car_slug_key" ON "Car"("slug");