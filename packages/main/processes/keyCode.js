/*
 * `keyCode`
 *
 * Maps a DOM event to a keyCode. Use on input's keyup and keydown events.
 *
 */

import map from 'zen-signals/map'
import prop from 'ramda/src/prop'

export default map(prop('keyCode'))
