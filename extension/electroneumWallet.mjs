import { Wallet, JsonRpcApiProvider } from 'ethers';
import Web3 from 'web3';
import { isAddress } from 'web3-validator';

class ElectroneumWallet {
    constructor(rpcUrl = "https://rpc.ankr.com/electroneum_testnet") {
        if (!rpcUrl) {
            throw new Error('Electroneum Network RPC URL is required');
        }
        // Connect to Electroneum Network
        this.web3 = new Web3(rpcUrl);
        this.wallet = null;
        
        // Electroneum Network specific configurations
        this.ELECTRONEUM_CHAIN_ID = 5201420; // Example chain ID, update as necessary
        this.NATIVE_TOKEN_DECIMALS = 18; // Electroneum token decimals
    }

    async createWallet(privateKey = null) {
        try {
            if (privateKey) {   
                this.wallet = new Wallet(privateKey);
            } else {
                this.wallet = Wallet.createRandom();
            }

            // Connect wallet to Electroneum network
            const provider = new JsonRpcApiProvider(this.web3.currentProvider.url);
            this.wallet = this.wallet.connect(provider);

            return {
                address: this.wallet.address,
                publicKey: this.wallet.publicKey,
                privateKey: this.wallet.privateKey
            };
        } catch (error) {
            throw new Error(`Failed to create Electroneum wallet: ${error.message}`);
        }
    }

    async getBalance(address) {
        try {
            if (!address) {
                throw new Error('Address is required');
            }

            const balance = await this.web3.eth.getBalance(address);
            return this.web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            throw new Error(`Failed to get ETN balance: ${error.message}`);
        }
    }

    async sendTransaction(toAddress, amount, options = {}) {
        try {
            if (!this.wallet) {
                throw new Error('Wallet not initialized');
            }

            if (!toAddress || !amount) {
                throw new Error('Recipient address and amount are required');
            }

            const valueInWei = this.web3.utils.toWei(amount.toString(), 'ether');
            const gasPrice = options.gasPrice || await this.web3.eth.getGasPrice();
            
            const transaction = {
                to: toAddress,
                value: valueInWei,
                gasLimit: options.gasLimit || '21000',
                gasPrice: gasPrice,
                nonce: await this.web3.eth.getTransactionCount(this.wallet.address),
                chainId: this.ELECTRONEUM_CHAIN_ID
            };

            const signedTx = await this.wallet.signTransaction(transaction);
            const receipt = await this.web3.eth.sendSignedTransaction(signedTx);

            return receipt;
        } catch (error) {
            throw new Error(`Failed to send ETN tokens: ${error.message}`);
        }
    }

    isValidElectroneumAddress(address) {
        return isAddress(address);
    }

    async getTransactionStatus(txHash) {
        try {
            return await this.web3.eth.getTransactionReceipt(txHash);
        } catch (error) {
            throw new Error(`Failed to get transaction status on Electroneum network: ${error.message}`);
        }
    }
}

export default ElectroneumWallet;
