import { Wallet, JsonRpcApiProvider } from 'ethers';
import Web3 from 'web3';
import { isAddress } from 'web3-validator';

class BaseWallet {
    constructor(rpcUrl = "https://base-sepolia.drpc.org") {
        if (!rpcUrl) {
            throw new Error('Base Network RPC URL is required');
        }
        // Connect to Base Sepolia testnet
        this.web3 = new Web3(rpcUrl);
        this.wallet = null;
        
        // Base Sepolia testnet specific configurations
        this.BASE_CHAIN_ID = 84532; // Base Sepolia testnet chain ID
        this.NATIVE_TOKEN_DECIMALS = 18; // ETH decimals
    }

    /**
     * Create a new wallet or import existing one from private key
     * @param {string} privateKey - Optional private key to import existing wallet
     * @returns {Object} Wallet address and public key
     */
    async createWallet(privateKey = null) {
        try {
            if (privateKey) {   
                this.wallet = new Wallet(privateKey);
            } else {
                this.wallet = Wallet.createRandom();
            }

            // Connect wallet to Base Sepolia network
            const provider = new JsonRpcApiProvider(this.web3.currentProvider.url);
            this.wallet = this.wallet.connect(provider);

            return {
                address: this.wallet.address,
                publicKey: this.wallet.publicKey,
                privateKey: this.wallet.privateKey
            };
        } catch (error) {
            throw new Error(`Failed to create Base wallet: ${error.message}`);
        }
    }

    /**
     * Get balance of native token (ETH)
     * @param {string} address - Wallet address to check balance
     * @returns {string} Balance in ETH
     */
    async getBalance(address) {
        try {
            if (!address) {
                throw new Error('Address is required');
            }

            const balance = await this.web3.eth.getBalance(address);
            // Convert from smallest unit to ETH
            return this.web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            throw new Error(`Failed to get ETH balance: ${error.message}`);
        }
    }

    /**
     * Send ETH on Base Sepolia network
     * @param {string} toAddress - Recipient address
     * @param {string} amount - Amount in ETH
     * @param {Object} options - Transaction options
     * @returns {Object} Transaction receipt
     */
    async sendTransaction(toAddress, amount, options = {}) {
        try {
            if (!this.wallet) {
                throw new Error('Wallet not initialized');
            }

            if (!toAddress || !amount) {
                throw new Error('Recipient address and amount are required');
            }

            // Convert ETH to smallest unit (wei)
            const valueInWei = this.web3.utils.toWei(amount.toString(), 'ether');

            // Get current network gas price on Base Sepolia
            const gasPrice = options.gasPrice || await this.web3.eth.getGasPrice();
            
            // Prepare transaction for Base Sepolia network
            const transaction = {
                to: toAddress,
                value: valueInWei,
                gasLimit: options.gasLimit || '21000', // Standard gas limit for native token transfer
                gasPrice: gasPrice,
                nonce: await this.web3.eth.getTransactionCount(this.wallet.address),
                chainId: this.BASE_CHAIN_ID
            };

            // Sign and send transaction
            const signedTx = await this.wallet.signTransaction(transaction);
            const receipt = await this.web3.eth.sendSignedTransaction(signedTx);

            return receipt;
        } catch (error) {
            throw new Error(`Failed to send ETH: ${error.message}`);
        }
    }

    /**
     * Validate if address is valid Ethereum address
     * @param {string} address - Address to validate
     * @returns {boolean} Whether address is valid
     */
    isValidBaseAddress(address) {
        return isAddress(address);
    }

    /**
     * Get transaction status on Base Sepolia network
     * @param {string} txHash - Transaction hash
     * @returns {Object} Transaction receipt
     */
    async getTransactionStatus(txHash) {
        try {
            return await this.web3.eth.getTransactionReceipt(txHash);
        } catch (error) {
            throw new Error(`Failed to get transaction status on Base network: ${error.message}`);
        }
    }
}

export default BaseWallet;