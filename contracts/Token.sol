// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

error NotEnoughTokens();

contract Token {
    string public constant NAME = "Pakata's hardhat Token";
    string public constant SYMBOL = "PKT";

    uint256 public constant TOTAL_SYPPLY = 1000000;

    address immutable i_owner;
    mapping(address => uint) s_balances;

    // The Transfer event helps off-chain applications understand
    // what happens within your contract.
    event Transfer(address indexed _from, address indexed _to, uint256 value);

    constructor() {
        i_owner = msg.sender;
        s_balances[msg.sender] = TOTAL_SYPPLY;
    }

    function transfer(address to, uint256 amount) external {
        if (amount > s_balances[msg.sender]) {
            revert NotEnoughTokens();
        }

        s_balances[to] += amount;
        s_balances[msg.sender] -= amount;

        // Notify off-chain applications of the transfer.
        emit Transfer(msg.sender, to, amount);
    }

    /**
     * Read only function to retrieve the token balance of a given account.
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     */
    function balanceOf(address accountAddress) external view returns (uint256) {
        return s_balances[accountAddress];
    }
}
