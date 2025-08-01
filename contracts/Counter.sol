// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint256 public count;
    address public owner;
    
    event CountIncremented(uint256 newCount);
    event CountDecremented(uint256 newCount);
    event CountReset();
    
    constructor() {
        count = 0;
        owner = msg.sender;
    }
    
    function increment() public {
        count += 1;
        emit CountIncremented(count);
    }
    
    function decrement() public {
        require(count > 0, "Count cannot be negative");
        count -= 1;
        emit CountDecremented(count);
    }
    
    function reset() public {
        require(msg.sender == owner, "Only owner can reset");
        count = 0;
        emit CountReset();
    }
    
    function getCount() public view returns (uint256) {
        return count;
    }
}

