import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../Base';

class App extends React.Component {
    constructor() {
        super(); // you can't use the keyword 'this' without super();
        this.addFish = this.addFish.bind(this); //add AddFish to App
        this.removeFish = this.removeFish.bind(this);
        this.removeOrder = this.removeOrder.bind(this);
        this.loadSamples = this.loadSamples.bind(this); // You have to do this every time
        this.addToOrder = this.addToOrder.bind(this);
        this.updateFish = this.updatedFish.bind(this);
        //getinitialState
        this.state = {
            fishes: {},
            order: {}
        };
    }

    componentWillMount() {
        //this runs before the app is rendered
        this.ref = base.syncState(`${this.props.params.storeId}/fishes`,  {
            context: this,
            state: 'fishes'
        });

        //check if there is any order in localStorage
        const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

        if(localStorageRef) {
            //udpate app components order state
            this.setState({
                order: JSON.parse(localStorageRef)
            });
        }
    }

    componentWillUnmount() {
        base.removeBinding(this.ref);
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order)); //localStorage needs a string
    }

    addFish(fish) {
        //update our state
        const fishes = {...this.state.fishes};
        // ... is an ES6 spread. Basically takes a copy.
        //this.state.fishes = existing state

        //add in new fish
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;
        //set state
        this.setState({ fishes }) //becuase they are the same name we don't need to do fishes: fishes ... ES6 FTW.
    }

    updatedFish(key, updateFish) {
        const fishes = {...this.state.fishes};
        fishes[key] = updateFish;
        this.setState({ fishes });
    }

    removeFish(key) {
        const fishes = {...this.state.fishes};
        fishes[key] = null;
        this.setState({ fishes });
    }

    loadSamples() {
        this.setState({
            fishes: sampleFishes
        })
    }

    addToOrder(key) {
        //take a copy of our state
        const order = {...this.state.order};
        // update or add the new number of fish ordered
        order[key] = order[key] + 1 || 1;
        //update our state
        this.setState({ order });
    }

    removeOrder(key) {
        const order = {...this.state.order};
        delete order[key];
        this.setState({ order });
    }


    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                    {
                        Object
                        .keys(this.state.fishes)
                        .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)
                    }
                    </ul>
                </div>
                <Order
                    fishes={this.state.fishes}
                    order={this.state.order}
                    params={this.props.params}
                    removeOrder={this.removeOrder}
                    />
                <Inventory
                fishes={this.state.fishes}
                addFish={this.addFish}
                loadSamples={this.loadSamples}
                updateFish={this.updateFish}
                removeFish={this.removeFish}
                storeId={this.props.params.storeId} />
            </div>
        )
    }
}

App.propTypes = {
    params: React.PropTypes.object.isRequired
}

export default App;
