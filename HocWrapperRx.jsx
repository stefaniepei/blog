import React from 'react'
import { BehaviorSubject } from 'rxjs'
import { scan, map } from 'rxjs/operators';

export const HocWrapperRx = (WrappedComponent, observableFactory, defaultState) => {
  return class extends React.PureComponent{
    constructor(){
      super(...arguments)
      this.state = defaultState
      this.props$ = observableFactory(this.props,this.state)
    }
    componentDidMount(){
      this.subscription = this.props$.subscribe(value=>this.setState(value))
    }
    componentWillUnmount(){
      this.subscription.unsubscribe()
    }
    render(){
      return <WrappedComponent {...this.props} {...this.state} />
    }
  }
}

// demo
export default HocWrapperRx(CounterView,() => {
  const counter = new BehaviorSubject(0);
  return counter.pipe(
      scan((result, inc) => result + inc, 0),
      map(value => ({ count: value, onInc: () => counter.next(1), onDec: () => counter.next(-1)}))
    )
},0)