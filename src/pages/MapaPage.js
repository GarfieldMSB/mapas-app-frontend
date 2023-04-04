import React, { useContext, useEffect } from 'react'
import { SocketContext } from '../context/SocketContext';
import { useMapbox } from '../hooks/useMapbox';
import { useSocket } from '../hooks/useSocket';
import { useSocketMapbox } from '../hooks/useSocketMapbox';



export const MapaPage = () => {

    const {coordenadas, setRef} = useSocketMapbox();

    return (
        <>
            <div className='info'>
                LNG: {coordenadas.lng} | LAT: {coordenadas.lat} | ZOOM: {coordenadas.zoom}
            </div>
            <div
                ref={setRef}
                className="mapContainer"
            />
        </>
    )
}
