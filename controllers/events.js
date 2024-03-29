const { response } = require("express");
const evento = require("../models/Evento");

const getEventos = async (req, res = response) => {
  const eventos = await evento.find().populate("user", "name");

  res.json({
    ok: true,
    eventos,
  });
};

const crearEvento = async (req, res = response) => {
  try {
    const nuevoEvento  = new evento(req.body);
    nuevoEvento.user = req.uid;

    const eventoGuardado = await nuevoEvento.save();

    res.json({
      ok: true,
      evento: eventoGuardado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarEvento = async (req, res = response) => {

  try{
    const eventoId = req.params.id;
    const uid = req.uid;

    const eventoExistente = await evento.findById(eventoId); // Cambiado a minúscula

    if (!eventoExistente) {
      return res.status(404).json({
        ok: false,
        msg: 'El evento no existe por ese id',
      });
    }

    if (eventoExistente.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene la autorización de editar este evento',
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: uid,
    };

    const eventoActualizado = await evento.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      { new: true }
    );

    res.json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const eliminarEvento = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;

  try {
    const Evento = await evento.findById(eventoId);

    if (!Evento) {
      return res.status(404).json({
        ok: false,
        msg: "el evento no existe por ese id ",
      });
    }

    if (Evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene la autorizacion de Eliminar este evento",
      });
    }

    await evento.findByIdAndDelete(eventoId);

    res.json({
      ok: true,
      msg: "Evento Eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "hable con el administrador",
    });
  }
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
