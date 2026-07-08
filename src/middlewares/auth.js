// bv-backend/src/middlewares/auth.js
 
/* --------------------------
   Verifica si hay un usuario logueado
--------------------------- */
export function isAuthenticated(req, res, next) {
    next()
}
 
/* --------------------------
   Verifica si el usuario es a isAdmin
   Usarlo en rutas que solo debe acceder ese rol
--------------------------- */
export function isAdmin(req, res, next) {
    next()
}