// route = "/campaigns/address/requests/new"

import React, {Component} from "react";
import Layout from "../../../components/Layout";
import {Form , Button , Message, Input} from "semantic-ui-react";
import web3 from "../../../ethereum/web3";
import Campaign from "../../../ethereum/campaign";
// Link is exported from routes.js . It helps to create a link that can navigate user to specified route
// Route allows us to route user to any route we want which is not feature of traditional nextjs we used next-route package for it
import {Link, Router} from "../../../routes";

class RequestNew extends Component {

  state = {
    description: "",
    value: "",
    recipient: "",
    loading: false,
    errorMessage: ""
  }

  static async getInitialProps(props) {
    const {address} = props.query;

    return {address};
  }

  onSubmit = async (event) => {
    this.setState({loading: true, errorMessage: ""});
    event.preventDefault();
    const campaign = Campaign(this.props.address);
    const {description, value, recipient} = this.state;
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.createRequest(description,web3.utils.toWei(value, 'ether'),recipient)
        .send({
          from: accounts[0]
        });
        // Redirect user to specified route , pushRoute allows user to go back to page on which they were previously
        Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({errorMessage: err.message});
    }
    this.setState({loading: false})
  };

  render() {
    return (
      <Layout>
        <Link legacyBehavior route={`/campaigns/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <h3>Create a Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event => this.setState({description: event.target.value})}
            />
          </Form.Field>
          <Form.Field>
            <label>Value in Ether</label>
            <Input
              value={this.state.value}
              onChange={event => this.setState({value: event.target.value})}
              label="Ether"
              labelPosition="right"
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={event => this.setState({recipient: event.target.value})}
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            Request
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
