// bv-backend/src/middlewares/auth.js

/* --------------------------
   Verifica si hay un usuario logueado
--------------------------- */
export function isAuthenticated(req, res, next) {
    if (!req.session?.user) {
        return res.status(401).json({ message: 'No autenticado' })
    }
    next()
}

export function isAdmin(req, res, next) {
    if (!req.session?.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso solo para administradores' })
    }
    next()
}