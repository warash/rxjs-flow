# rxjs-flow

> set of simple helper methods, which will help you arrange your data manipulation using rxjs in unidirectional way.

Library uses "redux-like" approach with usage of benefits from rxjs. Redux is one of the best data flow library at the moment, but it sucks because a lot of boilerplate code, massive switch statements etc..
Rxjs is really elegant but its kinda new kind in the block, so there is no one way how to manage your state using it. With Rxjs you can endup with a lot of messy code.

rxjs-flow is taking best parts from both worlds. Its elegant, expressive and pretty straight forward at the same time.


````sh
    npm install --save rxjs-flow
````

## Quick start

example code looks like below:

````javascript
const initState = {
  type: 'all',
  products: [],
  busy: false
};


@Injectable()
export class ProductListStore extends BaseStore {

  constructor(private af: AngularFire) {
    super();

    this.af.database.list('/products')
      .reaction(this.onProductLoaded, this.onSetBusy)
      .pour(this.updates$);
  }

  //mutations
  private onSetBusy(state) {
    return assign(state, {busy: true});
  }

  private onProductLoaded(products, state) {
    return assign(state, {products, busy: false});
  }

  private onFilterChanged(type, state) {
    return assign(state, {type});
  }

  //selectors
  products$ = this.state$.map(s => {
    if (s.type === 'all') return s.products;
    return filter(s.products, {type: s.type});
  });

  //actions
  filterByType$ = new Subject<string>();

  //reactions
  private filterOnClient = this.filterByType$
    .reaction(this.onFilterChanged).pour(this.updates$);
}

````




