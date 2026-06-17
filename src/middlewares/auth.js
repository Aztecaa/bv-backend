// bv-backend/src/middlewares/auth.js
 
/* --------------------------
   Verifica si hay un usuario logueado
--------------------------- */
export function isAuthenticated(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(403).json({ message: 'No autenticado' })
    }
    next()
}
 
/* --------------------------
   Verifica si el usuario es a isAdmin
   Usarlo en rutas que solo debe acceder ese rol
--------------------------- */
export function isAdmin(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(403).json({ message: 'No autenticado' })
    }
 
    if (req.session.user.role !== 'amiisAdmin') {
        return res.status(403).json({ message: 'Acceso denegado' })
    }
 
    next()
}