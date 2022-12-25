// route = "/campaigns/new"
import React, {Component} from "react";
import factory from "../../ethereum/factory";
import Layout from "../../components/Layout";
import {Form , Button , Input, Message} from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import {Router} from "../../routes";

class CampaignNew extends Component {

  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false
  };

  changeAmount(event) {
    return this.setState({minimumContribution: event.target.value});
  }

  createNewCampaign = async (event) => {

    event.preventDefault();
    this.setState({loading: true, errorMessage: ""});
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0]
        });
      Router.pushRoute("/");
    } catch (err) {
      this.setState({errorMessage: err.message});
    }
    this.setState({loading: false});
  }

  render() {
    return (
      <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={this.createNewCampaign} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Minimum Contribution To Become A Contributor</label>
          <Input
            value={this.state.minimumContribution}
            onChange={(event) => {this.changeAmount(event)}}
            label="Wei"
            labelPosition="right"
          />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage}/>
        <Button primary loading={this.state.loading}>Create</Button>
      </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
