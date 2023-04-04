import mapboxgl from "mapbox-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Subject } from "rxjs";
import { v4 as uuidv4 } from "uuid";


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export const useMapbox = (puntoInicial) => {

    // Mostrar el mapa
    const mapaDiv = useRef();
    // Referencia al div del mapa
    const setRef = useCallback((node) => {
        mapaDiv.current = node;
    }, []);

    // Referencia a los marcadores
    const marcadores = useRef({});

    // Observables de RXJS
    const movimientoMarcador = useRef( new Subject() );
    const nuevoMarcador = useRef( new Subject() );

    // Mapa y coordenadas
    // const [mapa, setMapa] = useState();
    const mapa = useRef();
    const [coordenadas, setCoordenadas] = useState(puntoInicial);

    // Funcion para agregar marcadores
    const agregarMarcador = useCallback((ev, id) => {
        const { lng, lat } = ev.lngLat || ev;

        const marcador = new mapboxgl.Marker();
        marcador.id = id ?? uuidv4(); // TODO: si el marcador ya tiene ID

        marcador.setLngLat([lng, lat]).addTo(mapa.current).setDraggable(true);

        // Asignamos el objeto de marcadores
        marcadores.current[marcador.id] = marcador;

        // TODO: Si el marcador tiene  ID no emitir
        if(!id) {
            nuevoMarcador.current.next({
                id: marcador.id,
                lng, 
                lat
            });
        }

        // Escuchar movimientos del marcador
        marcador.on('drag', ({target}) => {
            const {id} = target;
            const {lng, lat} = target.getLngLat();
            
            // TODO: Emitir los cambios del marcador
            movimientoMarcador.current.next({
                id,
                lng,
                lat
            })
        })


    }, [])

    // Funcion para actualizar la ubicacion del marcador
    const actualizarPosicion = useCallback(({id, lng, lat}) => {
        marcadores.current[id].setLngLat([ lng, lat ]);
    }, [])

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapaDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [puntoInicial.lng, puntoInicial.lat],
            zoom: puntoInicial.zoom
        });

        // setMapa(map);
        mapa.current = map;
    }, [puntoInicial]);


    // Cuando se mueve el mapa
    useEffect(() => {
        // -- ? -- Si el mapa tiene valor continua
        // mapa?.on('move', () => {
        mapa.current.on('move', () => {
            const { lng, lat } = mapa.current.getCenter();
            setCoordenadas({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: mapa.current.getZoom().toFixed(2)
            })
        });

        // Como no vamos a destruir este mapa, no aplicamos el return 
        // return mapa?.off('move');

    }, []);

    // Agregar marcadores al hacer click
    useEffect(() => {
        // mapa.current?.on('click', (ev) => {
        //     agregarMarcador(ev);

        // //     // const { lng, lat } = ev.lngLat;

        // //     // const marcador = new mapboxgl.Marker();

        // //     // marcador.id = uuidv4(); // TODO: si el marcador ya tiene ID

        // //     // marcador.setLngLat([lng, lat]).addTo(mapa.current).setDraggable(true);

        // //     // marcadores.current[ marcador.id ] = marcador;
        // })

        mapa.current?.on('click', agregarMarcador)
    }, [agregarMarcador])





    return {
        actualizarPosicion,
        agregarMarcador,
        coordenadas,
        marcadores,
        movimientoMarcador$: movimientoMarcador.current,
        nuevoMarcador$: nuevoMarcador.current,
        setRef
    }
}
