import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../Base';

class Inventory extends React.Component {
    constructor() {
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.logOut = this.logOut.bind(this);
        this.authHandler = this.authHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            uid: null,
            owner: null
        }
    }

    componentDidMount() {
        base.onAuth((user) => {
            if (user) {
                this.authHandler(null, { user });
            }
        })
    }

    handleChange(e, key) {
        const fish = this.props.fishes[key];
        //take a copy of that fish and update it with the new data
        const updatedFish = {
            ...fish,
            [e.target.name]: e.target.value
        }
        this.props.updateFish(key, updatedFish);
    }

    authenticate(provider) {
        console.log(`Trying to login with ${provider}`);
        base.authWithOAuthPopup(provider, this.authHandler);
    }

    logOut() {
        base.unauth();
        this.setState({ uid: null });
    }

    authHandler(err, authData) {
        console.log(authData)
        if (err) {
            console.log(err);
            return;
        }

        // grabd the store info
        const storeRef = base.database().ref(this.props.storeId);

        //query the db for the data
        storeRef.once('value', (snapshot) => {
            const data = snapshot.val() || {};

            //claim it as our own
            if(!data.owner) {
                storeRef.set({
                    owner: authData.user.uid
                });
            }

            this.setState({
                uid: authData.user.uid,
                owner: data.owner || authData.user.uid
            });
        });

    }

    renderLogin() {
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign in to manage your store's inventory</p>
                <button className="github" onClick={() => this.authenticate('github')}>Login to GitHub</button>
                <button className="facebook" onClick={() => this.authenticate('facebook')}>Login with Facebook</button>
                <button className="twitter" onClick={() => this.authenticate('twitter')}>Login with Twitter</button>
            </nav>
        )
    }

    renderInventory(key) {
        const fish = this.props.fishes[key];
        return (
            <div className="fish-edit" key={key}>
            <input type="text" placeholder="Fish Name" name="name" value={fish.name} onChange={(e) => this.handleChange(e, key)}/>
            <input type="text" placeholder="Fish Price" name="price" value={fish.price} onChange={(e) => this.handleChange(e, key)}/>
            <select type="text" placeholder="Fish Status" name="status" value={fish.status} onChange={(e) => this.handleChange(e, key)}>
                <option value="available">Fresh!</option>
                <option value="unavailable">Sold Out!</option>
            </select>
            <textarea type="text" placeholder="Fish Desc" name="desc" value={fish.desc} onChange={(e) => this.handleChange(e, key)}></textarea>
            <input type="text" placeholder="Fish Image" name="image" value={fish.image} onChange={(e) => this.handleChange(e, key)}/>
            <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
            </div>
        )
    }
    render() {
        const logout = <button onClick={this.logOut}>Log Out!</button>
        //check if they are not logged in
        if(!this.state.uid) {
            return (
                <div>{this.renderLogin()}</div>
            )
        }

        //check if they are the owner
        if(this.state.uid !== this.state.owner) {
            return(
                <div>
                    <p>sorry you aren't the owner of the store!</p>
                    {logout}
                </div>
            )
        }
        return (
            <div>
                <h2>Inventory</h2>
                {logout}
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm addFish={this.props.addFish}/>
                <button onClick={this.props.loadSamples}>Load sample fishes</button>
            </div>
        )
    }
}

Inventory.propTypes = {
    fishes: React.PropTypes.object.isRequired,
    updateFish: React.PropTypes.func.isRequired,
    removeFish: React.PropTypes.func.isRequired,
    addFish: React.PropTypes.func.isRequired,
    loadSamples: React.PropTypes.func.isRequired,
    storeId: React.PropTypes.string.isRequired
}

export default Inventory;
