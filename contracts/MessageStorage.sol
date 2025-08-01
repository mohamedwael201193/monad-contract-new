// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MessageStorage {
    string public message;
    address public owner;
    uint256 public messageCount;
    
    event MessageSet(string newMessage, address setter);
    event MessageCleared();
    
    constructor(string memory _initialMessage) {
        message = _initialMessage;
        owner = msg.sender;
        messageCount = 1;
    }
    
    function setMessage(string memory _message) public {
        require(bytes(_message).length > 0, "Message cannot be empty");
        message = _message;
        messageCount += 1;
        emit MessageSet(_message, msg.sender);
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
    
    function clearMessage() public {
        require(msg.sender == owner, "Only owner can clear message");
        message = "";
        emit MessageCleared();
    }
    
    function getMessageCount() public view returns (uint256) {
        return messageCount;
    }
}

