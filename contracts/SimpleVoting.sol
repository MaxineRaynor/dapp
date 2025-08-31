// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SimpleVoting
 * @dev A basic voting contract without encryption (for comparison)
 */
contract SimpleVoting {
    mapping(address => bool) public hasVoted;
    uint32 public yesVotes;  // Reduced from uint64 to save gas
    uint32 public noVotes;   // Reduced from uint64 to save gas
    uint32 public voteDeadline; // Reduced from uint256, enough until 2106
    address public owner;
    string public description;
    
    event VoteCast(address indexed voter, bool support);
    event VotingCreated(string description, uint256 deadline);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier votingOpen() {
        require(block.timestamp <= voteDeadline, "Voting period has ended");
        _;
    }
    
    constructor(string memory _description, uint256 _durationInMinutes) {
        owner = msg.sender;
        description = _description;
        voteDeadline = uint32(block.timestamp + (_durationInMinutes * 1 minutes));
        
        emit VotingCreated(_description, voteDeadline);
    }

    /**
     * @dev Cast a vote
     * @param support true for yes, false for no
     */
    function vote(bool support) public votingOpen {
        require(!hasVoted[msg.sender], "Already voted");
        hasVoted[msg.sender] = true;

        if (support) {
            yesVotes += 1;
        } else {
            noVotes += 1;
        }
        
        emit VoteCast(msg.sender, support);
    }

    /**
     * @dev Get the current vote results
     * @return yes count and no count
     */
    function getResults() public view returns (uint32, uint32) {
        return (yesVotes, noVotes);
    }
    
    /**
     * @dev Check if voting period is still active
     */
    function isVotingActive() public view returns (bool) {
        return block.timestamp <= voteDeadline;
    }
    
    /**
     * @dev Get voting information
     */
    function getVotingInfo() public view returns (string memory, uint256, bool) {
        return (description, voteDeadline, isVotingActive());
    }
}