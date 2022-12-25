// This is form component that allows user to contribute to campaigns

// As this is a react component we import react and we will use class defination
// to define react component
import React, { Component } from "react";
// semantic-ui-react pakage allows us to us premade components so we don't have to
// write all code from scratch and we pre-writed react components which comes comes with
// predefined styles. We imported specific components we needs.
import {Form, Input, Message, Button} from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

// We imported Router from routes.js which exports it(this comes fom pakage and is not predefined feature of nextjs)
// and allows us to redirect/route user to some specific route
import {Router} from "../routes";

// Defining react componets
class ContributeForm extends Component {

  // defining state to monitor various features in our form like inputs.
  // This is similiar to state hook (useState) which allows re-rendering of
  // contineously changing features like input fields.
  // state can be accessed by notation this.state.any_state_variable
  state = {
    value: "",
    errorMessage: "",
    loading: false
  }

  // this keyword allows us to access class properties(variables) and methods(function) defined inside class
  // onSubmit is a event handler that is triggered on form submit
  onSubmit = async (event) => {
    this.setState({loading: true, errorMessage: ""});  // We can use setState to set any state variable on change which we want
    event.preventDefault();
    const campaign = Campaign(this.props.address);
    try {
      // get the list of account from users wallet and use 1st account at index 0 for transaction
      const accounts = await web3.eth.getAccounts();
      // Calling the contribute function defined in our Campaign contract
      await campaign.methods.contribute()
        .send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.value, 'ether')
        });
        // Route user to other route (replaceRoute don't cache the previous route ie if we go back then we won't get back our form and data we filled)
        Router.replaceRoute(`/campaigns/${this.props.address}`)
    } catch (err) {
      this.setState({errorMessage: err.message});
    }
    this.setState({loading: false, value: ""});
  };

// errorMessage is a string so so to appear it as boolean we used !! ie twice negation
  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            value={this.state.value}
            onChange={event => this.setState({value: event.target.value})}
            label="ether"
            labelPosition="right"
          />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage}/>
        <Button primary loading={this.state.loading}>
          Contribute!
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
