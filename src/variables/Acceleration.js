import Variable from '../lib/Variable'

import Jerk from './Jerk'

import { VariableNames } from '../constants'

export default class Acceleration extends Variable {
  static name = VariableNames.ACCELERATION
  static derivative = Jerk
  static initial = [null, null, null]
}
