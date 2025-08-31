// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title SimpleVoting
 * @dev Gas-optimized voting contract for Sepolia deployment
 */
contract SimpleVoting {
    mapping(address => bool) public hasVoted;
    uint32 public yesVotes;
    uint32 public noVotes;
    uint32 public voteDeadline;
    address public owner;
    string public description;
    
    event VoteCast(address indexed voter, bool support);
    event VotingCreated(string description, uint256 deadline);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier votingOpen() {
        require(block.timestamp <= voteDeadline, "Voting ended");
        _;
    }
    
    constructor(string memory _description, uint256 _durationInMinutes) {
        owner = msg.sender;
        description = _description;
        voteDeadline = uint32(block.timestamp + (_durationInMinutes * 1 minutes));
        
        emit VotingCreated(_description, voteDeadline);
    }

    function vote(bool support) external votingOpen {
        require(!hasVoted[msg.sender], "Already voted");
        hasVoted[msg.sender] = true;

        if (support) {
            yesVotes += 1;
        } else {
            noVotes += 1;
        }
        
        emit VoteCast(msg.sender, support);
    }

    function getResults() external view returns (uint32, uint32) {
        return (yesVotes, noVotes);
    }
    
    function isVotingActive() external view returns (bool) {
        return block.timestamp <= voteDeadline;
    }
    
    function getVotingInfo() external view returns (string memory, uint256, bool) {
        return (description, voteDeadline, isVotingActive());
    }
}