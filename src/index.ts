import { Subject, Observable } from 'rxjs';
import { curry } from 'lodash';


export class BaseStore {

    protected updates$: Subject<any>;
    state$: Observable<any>;
    constructor(initialState = {}) {
        this.updates$ = new Subject<any>();

        this.state$ = this.updates$
            .scan((state, modifier) => modifier(state), initialState)
            .do(s => console.info("current state:", s))
            .publishReplay(1).refCount();

        this.state$.subscribe();
    }
}


export declare function reaction<T>(this: Observable<T>, success: Function, init?: Function, err?: Function): Observable<any>;
export declare function pour<T>(this: Observable<T>, dest: Subject<any>): any;

declare module 'rxjs/Observable' {
    interface Observable<T> {
        reaction: typeof reaction;
        pour: typeof pour;
    }
}

Observable.prototype.reaction = function (success, init, err) {
    let ret = this.map(x => curry(success)(x));
    if (init) {
        ret = ret.startWith(init)
    }
    if (err) {
        ret.catch(e => Observable.of(err))
    }
    return ret;
};
Observable.prototype.pour = function (dest: Subject<any>) {
    return this.subscribe(result => dest.next(result))
};

