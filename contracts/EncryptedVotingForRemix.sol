// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title EncryptedSimpleVotingSimplified
 * @dev Gas-optimized encrypted voting contract (demo version)
 */
contract EncryptedSimpleVotingSimplified {
    enum VotingStatus { Open, DecryptionInProgress, ResultsDecrypted }
    
    mapping(address => bool) public hasVoted;
    mapping(address => bytes32) private encryptedVotes;
    
    VotingStatus public status;
    uint32 public decryptedYesVotes;
    uint32 public decryptedNoVotes;
    uint256 public voteDeadline;
    address public owner;
    string public description;
    uint256 private voteCount;
    
    event VoteCast(address indexed voter);
    event VotingCreated(string description, uint256 deadline);
    event DecryptionRequested();
    event ResultsDecrypted(uint32 yesVotes, uint32 noVotes);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier votingOpen() {
        require(block.timestamp <= voteDeadline, "Voting ended");
        require(status == VotingStatus.Open, "Voting not open");
        _;
    }
    
    constructor(string memory _description, uint256 _durationInMinutes) {
        owner = msg.sender;
        description = _description;
        voteDeadline = block.timestamp + (_durationInMinutes * 1 minutes);
        status = VotingStatus.Open;
        
        emit VotingCreated(_description, voteDeadline);
    }

    function voteEncrypted(bytes32 encryptedSupport) external votingOpen {
        require(!hasVoted[msg.sender], "Already voted");
        hasVoted[msg.sender] = true;
        
        encryptedVotes[msg.sender] = encryptedSupport;
        voteCount++;
        
        emit VoteCast(msg.sender);
    }
    
    function votePlaintext(bool support) external votingOpen {
        require(!hasVoted[msg.sender], "Already voted");
        hasVoted[msg.sender] = true;
        
        bytes32 encryptedVote = keccak256(abi.encodePacked(support, msg.sender, block.timestamp));
        encryptedVotes[msg.sender] = encryptedVote;
        voteCount++;
        
        emit VoteCast(msg.sender);
    }

    function requestVoteDecryption() external {
        require(block.timestamp > voteDeadline, "Voting not finished");
        require(status == VotingStatus.Open, "Decryption requested");
        
        status = VotingStatus.DecryptionInProgress;
        _simulateDecryption();
        
        emit DecryptionRequested();
    }
    
    function _simulateDecryption() private {
        decryptedYesVotes = uint32(voteCount * 60 / 100);
        decryptedNoVotes = uint32(voteCount - decryptedYesVotes);
        status = VotingStatus.ResultsDecrypted;
        
        emit ResultsDecrypted(decryptedYesVotes, decryptedNoVotes);
    }

    function getResults() external view returns (uint32, uint32) {
        require(status == VotingStatus.ResultsDecrypted, "Results not decrypted");
        return (decryptedYesVotes, decryptedNoVotes);
    }
    
    function isVotingActive() external view returns (bool) {
        return block.timestamp <= voteDeadline && status == VotingStatus.Open;
    }
    
    function getVotingInfo() external view returns (string memory, uint256, bool, VotingStatus) {
        return (description, voteDeadline, isVotingActive(), status);
    }
    
    function getStatus() external view returns (VotingStatus, bool, bool, uint256) {
        bool votingEnded = block.timestamp > voteDeadline;
        bool canRequestDecryption = votingEnded && status == VotingStatus.Open;
        return (status, votingEnded, canRequestDecryption, voteCount);
    }
    
    function getVoteCount() external view returns (uint256) {
        return voteCount;
    }
}