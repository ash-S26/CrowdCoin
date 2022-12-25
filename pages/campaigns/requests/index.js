// route = "/campaigns/address/requests"
import React, {Component} from "react";
//importing react Layout Component
import Layout from "../../../components/Layout";
import {Button, Table} from "semantic-ui-react";
// Link is exported from routes.js . It helps to create a link that can navigate user to specified route
import {Link} from "../../../routes";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
  // This function runs just one time when page loads up , it is used to fetch initial values
  // needed and return them so they are accessable anywhere outside the class.
  // props in argument of this function is coming from route.js which is address parameter for dynamic routing. Its would have been empty () if there was no route used
  // Its is accessed by props.query.address.
  static async getInitialProps(props) {
    const {address} = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    // As solidity cannot return Array of structs we fetch all request (which are of struct type)
    // one by one.
    const requests = await Promise.all(
      Array(parseInt(requestCount)).fill().map((element, index) => {
        return campaign.methods.requests(index).call();
      })
    );

    return {address, requests, requestCount, approversCount}; // these are props accessed by notation this.props.any_property
  }

  // helper function to render row.
  // We are passing custom props to RequestRow react component
  // which can be accessed there by using this.props.request , this.props.id , etc
  renderRows() {
    console.log(this.props.requests);
    // map over all elements in requests (accessed in class by using this.props.request) array
    // and returns row element for each entery.
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }

  render() {

    const {Header , Row, HeaderCell, Body} = Table;

    return (
      <Layout>
        <h3>Requests</h3>
        <Link legacyBehavior route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{marginBottom: 10}}>Add Request</Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>
            {this.renderRows()}
          </Body>
        </Table>
        <div>Found {this.props.requestCount} requests.</div>
      </Layout>
    );
  }
}

export default RequestIndex;
