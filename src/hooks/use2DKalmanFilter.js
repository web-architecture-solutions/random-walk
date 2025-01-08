import { useState, useCallback } from 'react'

export function useKalmanFilter2D(config) {
  const [state, setState] = useState({
    mean: config.initialMean,
    covariance: config.initialCovariance
  })

  const kFilter = new KalmanFilter({
    dynamic: {
      init: {
        mean: config.initialMean,
        covariance: config.initialCovariance
      },
      transition: config.transition,
      covariance: config.processNoise
    },
    observation: {
      stateProjection: config.observation,
      covariance: config.observationNoise
    }
  })

  const update = useCallback(
    (observation) => {
      const { mean, covariance } = kFilter.filter(state.mean, state.covariance, observation)
      setState({ mean, covariance })
    },
    [kFilter, state.mean, state.covariance]
  )

  const reset = useCallback(() => {
    setState({
      mean: config.initialMean,
      covariance: config.initialCovariance
    })
  }, [config.initialMean, config.initialCovariance])

  return { state, update, reset }
}
