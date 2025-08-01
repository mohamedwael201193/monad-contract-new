// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Counter {
    uint256 public count;
    address public owner;
    
    event CountIncremented(uint256 newCount, address indexed incrementer);
    event CountDecremented(uint256 newCount, address indexed decrementer);
    event CountReset(address indexed resetter);
    
    constructor() {
        count = 0;
        owner = msg.sender;
    }
    
    function increment() public {
        count += 1;
        emit CountIncremented(count, msg.sender);
    }
    
    function decrement() public {
        require(count > 0, "Count cannot be negative");
        count -= 1;
        emit CountDecremented(count, msg.sender);
    }
    
    function reset() public {
        require(msg.sender == owner, "Only owner can reset");
        count = 0;
        emit CountReset(msg.sender);
    }
    
    function getCount() public view returns (uint256) {
        return count;
    }
}

