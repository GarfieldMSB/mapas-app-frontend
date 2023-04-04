import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { useMapbox } from "./useMapbox";

const puntoInicial = {
    lng: -124.8026,
    lat: 49.5002,
    zoom: 13.5,
}

export const useSocketMapbox = () => {

    const { coordenadas, setRef, nuevoMarcador$, movimientoMarcador$, agregarMarcador, actualizarPosicion } = useMapbox(puntoInicial);
    const { socket } = useContext(SocketContext);

    // Escuchar los marcadores existentes
    useEffect(() => {
        socket.on('marcadores-activos', (marcadores) => {
            for (const key of Object.keys(marcadores)) {
                agregarMarcador(marcadores[key], key);

            }
        });
    }, [socket, agregarMarcador]);

    // Emitir nuevo marcador
    useEffect(() => {
        nuevoMarcador$.subscribe(marcador => {
            // TODO: Nuevo marcador emitir
            socket.emit('marcador-nuevo', marcador);
        })
    }, [nuevoMarcador$, socket]);

     // Emitir el movimiento de marcador
     useEffect(() => {
        movimientoMarcador$.subscribe(marcador => {
            // TODO: Nuevo marcador emitir
            socket.emit('marcador-actualizado', marcador);
        });
    }, [movimientoMarcador$, socket]);

    // TODO: Mover marcador mediante sockets
    useEffect(() => {
        socket.on('marcador-actualizado', (marcador) => {
            actualizarPosicion(marcador)
        })
    }, [socket, actualizarPosicion])

    // Escuchar nuevos marcadores
    useEffect(() => {
        socket.on('marcador-nuevo', (marcador) => {
            agregarMarcador(marcador, marcador.id)
        })
    }, [socket, agregarMarcador]);

    return {
        coordenadas,
        setRef,
    }
}
