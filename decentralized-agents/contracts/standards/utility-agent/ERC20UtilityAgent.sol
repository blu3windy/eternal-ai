// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import {ERC20Votes, EIP712} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {UtilityAgent} from "./UtilityAgent.sol";

contract ERC20UtilityAgent is ERC20, ERC20Permit, ERC20Votes, UtilityAgent {
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 amount_,
        address recipient_,
        string memory systemPrompt_,
        bytes memory storageInfo_
    )
        ERC20(name_, symbol_)
        ERC20Permit(name_)
        UtilityAgent(systemPrompt_, storageInfo_)
    {
        _mint(recipient_, amount_);
    }

    function prompt(
        bytes memory request
    ) external payable virtual override returns (uint256) {}

    function prompt(
        bytes32 uuid,
        bytes calldata request
    ) external payable virtual override returns (uint256) {}

    function getResultById(
        bytes32 uuid
    ) external view override returns (bytes memory) {}

    function getResultById(
        uint256 id
    ) external view override returns (bytes memory) {}

    function _mint(
        address account,
        uint256 amount
    ) internal virtual override(ERC20, ERC20Votes) {
        return ERC20Votes._mint(account, amount);
    }

    function _burn(
        address account,
        uint256 amount
    ) internal virtual override(ERC20, ERC20Votes) {
        ERC20Votes._burn(account, amount);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20, ERC20Votes) {
        ERC20Votes._afterTokenTransfer(from, to, amount);
    }
}
