//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./GBCToken.sol";
import "./Treasury.sol";

contract GOV {
    uint256 ticket = 10 **18; //1 GBC = 1 ticket
    address payable public treasury;
    address public Token = 0x501D937f1ad407628810DE88C07F5cF8a8BD186c; //GBC address ,OKT network

    struct Voter{
        bool isVoted;   //是否投过票了
        bool isSupport; //是否支持
        uint256 votes;  //拥有多少票数
    }
    struct Proposal {
        uint256 id;                //提案ID
        address proposer;          //提案人
        uint256 forVotes;          //多少票支持
        uint256 againstVotes;      //多少票反对
    }

    constructor(address payable _treasury) public {
        treasury = _treasury;
        Proposal memory newProposal = Proposal({
            id: 0,
            proposer: msg.sender,
            forVotes: 0,
            againstVotes: 0
        });
        proposals[newProposal.id] = newProposal;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => Voter) public voters;

    //发提案，然后国库给钱
    function propose(uint256 proposalId) external {
        require(proposalId != 0,"incalid Id!");
        require(proposals[proposalId].id == 0,"This proposal already exists!");
        Proposal memory newProposal = Proposal({
            id : proposalId,
            proposer : msg.sender,
            forVotes : 0,
            againstVotes : 0
        });
        proposals[proposalId] = newProposal;
        Treasury(treasury).withdraw(msg.sender);
    }

    function vote( uint256 proposalId, bool support) public {
        require(proposalId != 0,"incalid Id!");
        require(proposals[proposalId].id != 0,"This proposal not exists!");
        address voter = msg.sender;
        Proposal memory proposal = proposals[proposalId];
        Voter memory sender = voters[voter];
        require(!sender.isVoted, "Already voted.");
        uint256 balance = GBCToken(Token).balanceOf(voter);
        require(balance >= ticket,"proposer votes below proposal threshold");
        uint256 votes = SafeMath.div(balance, ticket);

        if (support) {
            proposal.forVotes = SafeMath.add(proposal.forVotes, votes);
        } else {
            proposal.againstVotes = SafeMath.add(proposal.againstVotes, votes);
        }

        sender.isVoted = true;
        sender.isSupport = support;
        sender.votes = votes;
        voters[voter] = sender;
    }
}