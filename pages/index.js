// route = "/"
import React, {Component} from "react";
import {Card, Button} from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import {Link} from "../routes";

class CampaignIndex extends Component {

  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return {campaigns: campaigns};
  }

  renderCampaigns() {
    // map over campaigns array which have address for all campaign and it would return a list of
    // objects.
    const items = this.props.campaigns.map(address => {
      return ({
        header: address,
        description: (
          // <a href={"/campaigns/"+address}>View Campaign</a>
          <Link legacyBehavior route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true
      });
    });
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>
          <Link legacyBehavior route="/campaigns/new">
            <a>
              <Button
                content="Create Campaign"
                icon="add circle"
                primary
                floated="right"
              />
            </a>
          </Link>
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
