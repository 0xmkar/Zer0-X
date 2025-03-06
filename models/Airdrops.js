import mongoose from "mongoose";

const TokenDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  contractAddress: { type: String, required: true },
  decimals: { type: Number, required: true },
  blockchain: { type: String, required: true }
});

const AirdropSchema = new mongoose.Schema({
  airdropId: { type: String, required: true, unique: true },
  airdropName: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  totalAirdropAmount: { type: Number, required: true },
  tokensPerUser: { type: Number, required: true },
  distributionMethod: { type: String, required: true },
  eligibilityCriteria: { type: String, required: true },
  airdropStartDate: { type: Date, required: true },
  airdropEndDate: { type: Date, required: true },
  distributionDate: { type: Date, required: true },
  claimDeadline: { type: Date, required: true },
  token: { type: TokenDetailsSchema, required: true },
  people: [
    {
      twitterId: { type: String, required: true }, // Store Twitter ID
      walletAddress: { type: String, required: true }, // Store wallet address
      joinedAt: { type: Date, default: Date.now }, // Store join timestamp
    },
  ],
  tasks: [
    {
      taskId: { type: String, required: true }, // Store Twitter ID
      taskName: { type: String, required: true },
    },
  ],
}, {
  timestamps: true
});

const Airdrop = mongoose.model('Airdrop', AirdropSchema);
export default Airdrop;
