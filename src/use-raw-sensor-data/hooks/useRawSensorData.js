import { useCallback, useMemo } from 'react'

import useDeviceMotion from './useDeviceMotion'
import useDeviceOrienation from './useDeviceOrientation'
import useGeolocation from './useGeolocation'

export default function useRawSensorData(config) {
  const motion = useMemo(() => useDeviceMotion(config), [config])
  const orientation = useMemo(() => useDeviceOrienation(config), [config])
  const geolocation = useMemo(() => useGeolocation(config), [config])

  const rawSensorData = useMemo(
    () => ({ ...geolocation.data, ...motion.data, ...orientation.data }),
    [geolocation.data, motion.data, orientation.data]
  )

  const errors = useMemo(
    () => ({ ...motion.errors, ...orientation.errors, ...geolocation.errors }),
    [motion.errors, orientation.errors, geolocation.errors]
  )

  const isListening = useMemo(
    () => motion.isListening || orientation.isListening || geolocation.isListening,
    [motion.isListening, orientation.isListening, geolocation.isListening]
  )

  const refreshRates = useMemo(
    () => ({
      geolocation: geolocation.refreshRate,
      motion: motion.refreshRate,
      orientation: orientation.refreshRate
    }),
    [geolocation]
  )

  const startListening = useCallback(async () => {
    await Promise.all([motion.startListening(), orientation.startListening(), geolocation.startListening()])
  }, [motion.startListening, orientation.startListening, geolocation.startListening])

  return {
    rawSensorData,
    refreshRates,
    errors,
    isListening,
    startListening
  }
}
