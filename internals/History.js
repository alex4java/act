import reduce from 'ramda/src/reduce'
import splitAt from 'ramda/src/splitAt'
import take from 'ramda/src/take'
import delay from './delay'

export default class History {
  constructor (state, reducer, rerender) {
    this.timeline = []
    this.present = 0
    this.reduce = reduce(reducer)
    this.initialState = state
    this.state = state
    this.delta = []
    this.rerender = () => rerender(this.state)
    this.undo = () => this.go(this.present - 1)
    this.redo = () => this.go(this.present + 1)
  }

  subscribe () {
    return (subscription) => {
      this.subscription = subscription
    }
  }

  concat () {
    this.state = this.reduce(this.state, this.delta)
    const dom = this.rerender()
    const [past, future] = splitAt(this.present, this.timeline)
    this.timeline = [...past, ...this.delta, ...future]
    this.subscription &&
      this.subscription(this.timeline)

    this.present += this.delta.length
    this.delta = []
    return dom
  }

  get current () {
    return this.timeline[this.present - 1]
  }

  get previous () {
    return this.timeline[this.present - 2]
  }

  get next () {
    return this.timeline[this.present]
  }

  push (action) {
    this.delta.push(action)
    return delay(() => this.concat())
  }

  go (index) {
    if (index === this.present ||
        index < 0 ||
        index > this.timeline.length) {
      return
    }

    this.state = this.reduce(this.initialState, take(this.present = index, this.timeline))
    return this.rerender()
  }
}
