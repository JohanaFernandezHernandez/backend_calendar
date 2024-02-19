/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/
const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');

const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const {  validarJWT } = require('../middlewares/validar-jwt');


//Rutas
router.post(
    '/new',
     [//middelwares
        check('name','el nombre es obligatorio').not().isEmpty(),
        check('email','el email es obligatorio').isEmail(),
        check('password','el password debe tener minimo 6 caracteres').isLength({ min: 6}),
        validarCampos,
        
     ],
      crearUsuario
);

router.post(
    '/',
     [
        check('email','el email es obligatorio').isEmail(),
        check('password','el password debe tener minimo 6 caracteres').isLength({ min: 6}),
        validarCampos,
     ],
     loginUsuario
);

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;