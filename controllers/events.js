const {response } = require('express');
const evento = require('../models/Evento');

const getEventos = async(req, res = response) => {

    const eventos = await evento.find()
                                .populate('user','name');
                               

    res.json({
        ok: true,
        eventos
    });
};

const crearEvento = async (req, res = response) => {

    const evento = new evento (req.body);

    try {

        evento.user = req.uid

        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
        
    }
}

const actualizarEvento = async(req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const Evento = await evento.findById( eventoId );

        if(!Evento) {
            return res.status(404).json({
                ok: false,
                msg: "el evento no existe por ese id "
            })
        }

        if( Evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: "No tiene la autorizacion de editar este evento"
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true});

        res.json({
            ok: true,
            Evento: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: "hable con el administrador"
        }); 
    }

}

const eliminarEvento = async(req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const Evento = await evento.findById( eventoId );

        if(!Evento) {
            return res.status(404).json({
                ok: false,
                msg: "el evento no existe por ese id "
            })
        }

        if( Evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: "No tiene la autorizacion de Eliminar este evento"
            })
        }

        await evento.findByIdAndDelete(eventoId);

        res.json({
            ok: true,
            msg: "Evento Eliminado"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: "hable con el administrador"
        }); 
    }

    
}



module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento

}