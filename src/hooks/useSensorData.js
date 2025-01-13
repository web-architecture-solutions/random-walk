import { useCallback, useEffect, useMemo } from 'react'

import useDeviceMotion from './useDeviceMotion'
import useDeviceOrienation from './useDeviceOrientation'
import useGeolocation from './useGeolocation'

import usePrevious from './usePrevious'

import SensorData from '../lib/SensorData'

const sensorData = new SensorData({
  position: { latitude: 'y', longitude: 'x', altitude: 'z' },
  orientation: { alpha: 'yaw', beta: 'pitch', gamma: 'roll' },
  angularVelocity: { alpha: 'z', beta: 'x', gamma: 'y' }
})

export default function useSensorData(config = {}) {
  const motion = useDeviceMotion(config)
  const orientation = useDeviceOrienation(config)
  const geolocation = useGeolocation(config)

  useEffect(
    () =>
      sensorData.update({
        position: {
          latitude: geolocation.data?.latitude,
          longitude: geolocation.data?.longitude,
          altitude: geolocation.data?.altitude
        },
        acceleration: {
          x: motion.data?.acceleration.x,
          y: motion.data?.acceleration.y,
          z: motion.data?.acceleration.z
        },
        orientation: {
          alpha: orientation.data?.alpha,
          beta: orientation.data?.beta,
          gamma: orientation.data?.gamma
        },
        angularVelocity: {
          alpha: motion.data?.rotationRate.alpha,
          beta: motion.data?.rotationRate.beta,
          gamma: motion.data?.rotationRate.gamma
        }
      }),
    [motion.data, orientation.data, geolocation.data]
  )

  const errors = useMemo(
    () => ({ ...motion.errors, ...orientation.errors, ...geolocation.errors }),
    [motion.errors, orientation.errors, geolocation.errors]
  )

  const isListening = useMemo(
    () => motion.isListening || orientation.isListening || geolocation.isListening,
    [motion.isListening, orientation.isListening, geolocation.isListening]
  )

  const startListening = useCallback(async () => {
    await Promise.all([motion.startListening(), orientation.startListening(), geolocation.startListening()])
  }, [motion.startListening, orientation.startListening, geolocation.startListening])

  return {
    sensorData,
    errors,
    isListening,
    startListening
  }
}
