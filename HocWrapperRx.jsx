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

// demo-counter
export default HocWrapperRx(CounterView,() => {
  const counter = new BehaviorSubject(0);
  return counter.pipe(
      scan((result, inc) => result + inc, 0),
      map(value => ({ count: value, onInc: () => counter.next(1), onDec: () => counter.next(-1)}))
    )
},0)

// demo-timer
 export default HocWrapperRx(TimerView,() => {
    const timer = new Subject();
    const time$ = timer.pipe(
      tap(ev => console.log(ev)),
      switchMap(value=>{
        switch(value){
          case START:
            return interval(100).pipe(
              // timeInterval(),
              scan((acc, val) => acc + val ,0),
              tap(ev => console.log(ev)))
              
          case STOP:
            return empty()
          case RESET:
            return of(0)
          default:
            return throwError('Invalid value ', value)
        }
      })
    )
    const stopTime = new BehaviorSubject(0)

    return merge(stopTime, time$).pipe(
        // tap(ev => console.log(ev)),
        map(value => ({ time: value, onStart: () => timer.next(START), onPause: () => timer.next(STOP), onReset: () => timer.next(RESET)}))
      )
  },0)
