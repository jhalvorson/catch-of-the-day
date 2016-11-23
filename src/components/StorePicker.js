import React from 'react';
import { getFunName } from '../helpers';

class StorePicker extends React.Component {
    // constructor() {
    //     super();
    //     this.goToStore = this.goToStore.bind(this);
    //     //looks for go to store moethod, looks for itself and then binds to this. Weird. This also needs to be done for every method 🎉
    // }
    //this is a method
    goToStore(event) {
        event.preventDefault(); //stop the page refresh
        console.log('You changed the URL');
        //first grab the text from the box
        const storeId = this.storeInput.value;
        //second we're going to transition from / to /store/:storeId
        this.context.router.transitionTo(`/store/${storeId}`);
        //We can do the above as we set the contextTypes below
    } // no commas on ES6 classes
    render() {
        return (
            <form className="store-selector" onSubmit={this.goToStore.bind(this)}>
                <h2>Please enter a store</h2>
                <input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref={(input) => {this.storeInput = input}}/>
                <button type="submit">Visit Store</button>
            </form>
        )
    }
}

//The following surfaces the router
// React does this as it makes sure that we actually need to use context
// Set context types >
StorePicker.contextTypes = {
    router: React.PropTypes.object
}

export default StorePicker;
