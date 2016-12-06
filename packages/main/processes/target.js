/*
 * `target`
 *
 * Maps a DOM event to its target value.
 *
 */

import map from 'zen-signals/map'
import prop from 'ramda/src/prop'

export default map(prop('target'))
