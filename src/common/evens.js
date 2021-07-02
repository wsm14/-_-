class Event {
  constructor() {
    this.callbacks = {}
  }
  $off(name) {
    this.callbacks[name] = null
  }
  $emit(name, args) {
    let cbs = this.callbacks[name]
    if (cbs) {
      cbs.forEach(c => {
        c.call(this, args)
      })
    }
  }
  $on(name, fn) {
    (this.callbacks[name] || (this.callbacks[name] = [])).push(fn)
  }
}
export default new Event()
