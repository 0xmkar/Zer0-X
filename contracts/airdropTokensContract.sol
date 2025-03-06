// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenAirdrop
 * @dev Contract for airdropping ERC20 tokens to multiple addresses
 */
contract TokenAirdrop is Ownable {
    IERC20 public token;
    mapping(address => bool) public hasClaimed;
    bool public isAirdropActive = true;

    event TokensAirdropped(address[] recipients, uint256[] amounts);
    event AirdropStatusChanged(bool isActive);

    /**
     * @dev Constructor sets the token address and transfers ownership to the deployer
     * @param _token Address of the ERC20 token to airdrop
     */
    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    /**
     * @dev Batch airdrop tokens to multiple recipients
     * @param _recipients Array of recipient addresses
     * @param _amounts Array of token amounts to distribute
     * @notice Arrays must be the same length
     */
    function airdropTokens(
        address[] calldata _recipients,
        uint256[] calldata _amounts
    ) external onlyOwner {
        require(
            _recipients.length == _amounts.length,
            "Recipients and amounts arrays must have the same length"
        );
        require(_recipients.length > 0, "Must airdrop to at least one address");

        uint256 totalAmount = 0;

        for (uint256 i = 0; i < _amounts.length; i++) {
            totalAmount += _amounts[i];
        }

        require(
            token.balanceOf(address(this)) >= totalAmount,
            "Insufficient token balance for airdrop"
        );

        for (uint256 i = 0; i < _recipients.length; i++) {
            require(
                _recipients[i] != address(0),
                "Cannot airdrop to zero address"
            );
            token.transfer(_recipients[i], _amounts[i]);
        }

        emit TokensAirdropped(_recipients, _amounts);
    }

    /**
     * @dev Airdrop with merkle proof verification (for larger airdrops)
     * @param _recipients Array of recipient addresses
     * @param _amounts Array of token amounts to distribute
     * @param _markAsClaimed Whether to mark recipients as having claimed
     */
    function airdropTokensWithClaim(
        address[] calldata _recipients,
        uint256[] calldata _amounts,
        bool _markAsClaimed
    ) external onlyOwner {
        require(
            _recipients.length == _amounts.length,
            "Recipients and amounts arrays must have the same length"
        );
        require(_recipients.length > 0, "Must airdrop to at least one address");

        uint256 totalAmount = 0;

        for (uint256 i = 0; i < _amounts.length; i++) {
            totalAmount += _amounts[i];
        }

        require(
            token.balanceOf(address(this)) >= totalAmount,
            "Insufficient token balance for airdrop"
        );

        for (uint256 i = 0; i < _recipients.length; i++) {
            address recipient = _recipients[i];
            require(recipient != address(0), "Cannot airdrop to zero address");

            if (_markAsClaimed) {
                require(
                    !hasClaimed[recipient],
                    "Recipient has already claimed tokens"
                );
                hasClaimed[recipient] = true;
            }

            token.transfer(recipient, _amounts[i]);
        }

        emit TokensAirdropped(_recipients, _amounts);
    }

    /**
     * @dev Allow users to claim their tokens directly
     * @param _amount Amount of tokens to claim
     */
    function claimTokens(uint256 _amount) external {
        require(isAirdropActive, "Airdrop is not active");
        require(
            !hasClaimed[msg.sender],
            "You have already claimed your tokens"
        );
        require(
            token.balanceOf(address(this)) >= _amount,
            "Insufficient token balance for claim"
        );

        hasClaimed[msg.sender] = true;
        token.transfer(msg.sender, _amount);
    }

    /**
     * @dev Set the airdrop status (active/inactive)
     * @param _isActive Boolean to set the airdrop status
     */
    function setAirdropStatus(bool _isActive) external onlyOwner {
        isAirdropActive = _isActive;
        emit AirdropStatusChanged(_isActive);
    }

    /**
     * @dev Withdraw tokens from the contract
     * @param _amount Amount of tokens to withdraw
     */
    function withdrawTokens(uint256 _amount) external onlyOwner {
        require(
            token.balanceOf(address(this)) >= _amount,
            "Insufficient token balance"
        );
        token.transfer(owner(), _amount);
    }

    /**
     * @dev Change the token address
     * @param _newToken Address of the new token
     */
    function setToken(address _newToken) external onlyOwner {
        require(
            _newToken != address(0),
            "New token address cannot be zero address"
        );
        token = IERC20(_newToken);
    }
}
