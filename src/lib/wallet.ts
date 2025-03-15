import { Wallet, JsonRpcProvider } from 'ethers';
import Web3 from 'web3';

interface WalletInfo {
  address: string;
  publicKey: string;
  privateKey: string;
}

interface TransactionOptions {
  gasPrice?: string;
  gasLimit?: string;
}

class BaseWallet {
    private web3: Web3;
    private wallet: Wallet | null;
    private BASE_CHAIN_ID: number;
    private NATIVE_TOKEN_DECIMALS: number;

    constructor(rpcUrl: string = "https://base-sepolia.drpc.org") {
        if (!rpcUrl) {
            throw new Error('Base Network RPC URL is required');
        }
        // Connect to Base Sepolia Network
        this.web3 = new Web3(rpcUrl);
        this.wallet = null;
        
        // Base Sepolia Network specific configurations
        this.BASE_CHAIN_ID = 84532; // Base Sepolia testnet chain ID
        this.NATIVE_TOKEN_DECIMALS = 18; // ETH decimals
    }

    /**
     * Create a new wallet or import existing one from private key
     * @param {string} privateKey - Optional private key to import existing wallet
     * @returns {WalletInfo} Wallet address and public key
     */
    async createWallet(privateKey: string | null = null): Promise<WalletInfo> {
        try {
            if (privateKey) {   
                this.wallet = new Wallet(privateKey);
            } else {
                this.wallet = Wallet.createRandom();
            }

            // Connect wallet to Base network
            const provider = new JsonRpcProvider(this.web3.currentProvider.url);
            this.wallet = this.wallet.connect(provider);

            return {
                address: this.wallet.address,
                publicKey: this.wallet.publicKey,
                privateKey: this.wallet.privateKey
            };
        } catch (error) {
            throw new Error(`Failed to create Base wallet: ${(error as Error).message}`);
        }
    }

    /**
     * Get balance of native token (ETH)
     * @param {string} address - Wallet address to check balance
     * @returns {string} Balance in ETH
     */
    async getBalance(address: string): Promise<string> {
        try {
            if (!address) {
                throw new Error('Address is required');
            }

            const balance = await this.web3.eth.getBalance(address);
            // Convert from smallest unit to ETH
            return this.web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            throw new Error(`Failed to get ETH balance: ${(error as Error).message}`);
        }
    }

    /**
     * Send ETH on Base network
     * @param {string} toAddress - Recipient address
     * @param {string | number} amount - Amount in ETH
     * @param {TransactionOptions} options - Transaction options
     * @returns {Object} Transaction receipt
     */
    async sendTransaction(toAddress: string, amount: string | number, options: TransactionOptions = {}): Promise<any> {
        try {
            if (!this.wallet) {
                throw new Error('Wallet not initialized');
            }

            if (!toAddress || !amount) {
                throw new Error('Recipient address and amount are required');
            }

            // Convert ETH to smallest unit
            const valueInWei = this.web3.utils.toWei(amount.toString(), 'ether');

            // Get current network gas price on Base
            const gasPrice = options.gasPrice || await this.web3.eth.getGasPrice();
            
            // Prepare transaction for Base network
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
            throw new Error(`Failed to send ETH: ${(error as Error).message}`);
        }
    }

    /**
     * Validate if address is valid on Base network
     * @param {string} address - Address to validate
     * @returns {boolean} Whether address is valid
     */
    isValidBaseAddress(address: string): boolean {
        return this.web3.utils.isAddress(address);
    }

    /**
     * Get transaction status on Base network
     * @param {string} txHash - Transaction hash
     * @returns {Object} Transaction receipt
     */
    async getTransactionStatus(txHash: string): Promise<any> {
        try {
            return await this.web3.eth.getTransactionReceipt(txHash);
        } catch (error) {
            throw new Error(`Failed to get transaction status on Base network: ${(error as Error).message}`);
        }
    }
}

export default BaseWallet;