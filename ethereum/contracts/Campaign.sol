pragma solidity ^0.4.26;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address  newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]){
        return deployedCampaigns;
    }

}

contract Campaign {

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    address public manager;
    uint public minimumContribution;
    // mapping is "All value exists" so any value that is not defined
    // in map, then when we query for that key it return default
    // value depending on data type of values in key:value pair
    // that are 0 for int, false for bool, '' (empty str) for strings
    mapping(address => bool) public approvers; // searching in map is constant time operation
    Request[] public requests; // search time in array is linear . lookup/modify is constant time
    uint public approversCount;


    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    // function Campaign(uint minimum, address creator) public {
    //     manager = creator;
    //     minimumContribution = minimum;
    // }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string description,
        uint value, address recipient) public restricted {
        // memory is like temporary data and when an argument is passes
        // to function its of type memory. Where as storage is like
        // permanent data and like pointer in c no copy is created.
        // memory - pass by value
        // storage - pass by refrence
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
            // don't need to initialize refrence data types like
            // mapping and array. just need to intialize value types
        });

        requests.push(newRequest);
    }

   function approveRequest(uint index) public {

       Request storage request = requests[index];
       // validation that user has donated to project
       require(approvers[msg.sender]);
       // check if user has already voted
       require(!request.approvals[msg.sender]);
       // if user has donated and not voted then user can vote
       request.approvals[msg.sender] = true;
       request.approvalCount++;
   }

   function finalizeRequest(uint index) public restricted {
       Request storage request = requests[index];

       require(!request.complete);
       require(request.approvalCount > approversCount/2);

       request.recipient.transfer(request.value);
       request.complete = true;
   }

   function getSummary() public view returns (
            uint, uint, uint, uint, address
        ) {
            return (
                minimumContribution,
                address(this).balance,
                requests.length,
                approversCount,
                manager
       );
   }

   function getRequestsCount() public view returns (uint) {
       return requests.length;
   }

}
