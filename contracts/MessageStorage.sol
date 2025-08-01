// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MessageStorage {
    string public message;
    address public owner;
    uint256 public messageCount;
    
    event MessageSet(string newMessage, address indexed setter, uint256 messageNumber);
    event MessageCleared(address indexed clearer);
    
    constructor() {
        message = "Initial Message"; // Set a default message
        owner = msg.sender;
        messageCount = 1;
    }
    
    function setMessage(string memory _newMessage) public {
        require(bytes(_newMessage).length > 0, "Message cannot be empty");
        message = _newMessage;
        messageCount += 1;
        emit MessageSet(_newMessage, msg.sender, messageCount);
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
    
    function clearMessage() public {
        require(msg.sender == owner, "Only owner can clear message");
        message = "";
        emit MessageCleared(msg.sender);
    }
    
    function getMessageCount() public view returns (uint256) {
        return messageCount;
    }
}

