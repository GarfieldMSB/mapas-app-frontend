import React from 'react'

import { MapaPage } from './pages/MapaPage'
import {SocketProvider} from './context/SocketContext'

export const MapasApp = () => {
  return (
    <div>
      <SocketProvider>
        <MapaPage />
      </SocketProvider>
    </div>
  )
}
