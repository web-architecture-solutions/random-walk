import Variable from '../lib/variables/Variable'

import { VariableConstructors } from './constants'

export default class SensorData {
  #timestamp
  #previousTimestamp
  #previousDerivativesWrtT

  constructor(rawSensorData, previousRawSensorData, previousDerivativesWrtT, timestamp, previousTimestamp) {
    this.#timestamp = timestamp
    this.#previousTimestamp = previousTimestamp
    this.#previousDerivativesWrtT = previousDerivativesWrtT

    Object.entries(rawSensorData).forEach(([variableName, rawVariableState]) => {
      const previousRawVariableState = previousRawSensorData?.[variableName] ?? {}
      const previousVariableDerivativesWrtT = previousDerivativesWrtT?.[variableName] ?? {}
      const constructor = SensorData.getVariableConstructorByName(variableName)
      this[variableName] = new constructor(rawVariableState, previousRawVariableState, previousVariableDerivativesWrtT, constructor, this)
    })
  }

  static isEqual(sensorData1, sensorData2) {
    return Object.entries(sensorData1).every(([variableName, variableData]) => {
      return Variable.isEqual(variableData, sensorData2?.[variableName])
    })
  }

  static getVariableConstructorByName(variableName) {
    return VariableConstructors[variableName]
  }

  static get initial() {
    return Object.fromEntries(
      Object.entries(VariableConstructors).map(([variableName, variableConstructor]) => {
        return [variableName, variableConstructor.initial]
      })
    )
  }

  get isReady() {
    return !this.isEqual(SensorData.initial)
  }

  get timestamp() {
    return this.#timestamp
  }

  get previousTimestamp() {
    return this.#previousTimestamp
  }

  get derivativesWrtT() {
    const _derivativesWrtT = Object.fromEntries(
      Object.entries(this).reduce((derivatives, [_, variable]) => {
        if (variable.hasDerivative) {
          return [...derivatives, [variable.derivativeName, variable.derivativeWrtT]]
        }
        return derivatives
      }, [])
    )
    return new SensorData(_derivativesWrtT, this.#previousDerivativesWrtT, {}, this.#timestamp, this.#previousTimestamp)
  }

  isEqual(sensorData) {
    return SensorData.isEqual(this, sensorData)
  }
}
