import { useEffect, useState } from 'react'

import useRawSensorData from '../../use-raw-sensor-data'

import useIIRFilter from './useIIRFilter'

export default function useIIRFData(config = {}) {
  const { rawSensorData, refreshRates, errors, isListening, startListening } = useRawSensorData(config)

  const [refreshRate, setRefreshRate] = useState(null)

  useEffect(() => setRefreshRate(Math.max(...Object.values(refreshRates))), [refreshRates])

  const iirfData = useIIRFilter(refreshRate, isListening, rawSensorData)

  return {
    iirfData,
    rawSensorData,
    refreshRates,
    errors,
    isListening,
    startListening
  }
}
