import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';

class App extends React.Component {
    constructor() {
        super(); // you can't use the keyword 'this' without super();
        this.addFish = this.addFish.bind(this); //add AddFish to App
        //getinitialState
        this.state = {
            fishes: {},
            order: {}
        };
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


    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                </div>
                <Order />
                <Inventory addFish={this.addFish}/>
            </div>
        )
    }
}

export default App;
