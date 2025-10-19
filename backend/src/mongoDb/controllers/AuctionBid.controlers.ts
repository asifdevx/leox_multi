import { Bid } from "../schemas/marketplace.schema";

export const bids = async (tokenId: string, seller: string) => {
  const findBids = await Bid.find({ tokenId, seller: seller.toLowerCase() })
    .sort({ createdAt: -1 })
    .lean();
  const bidders = findBids.map((n: any) => ({
    ...n,
    createdAt:
      n.createdAt instanceof Date
        ? n.createdAt.toISOString()
        : new Date(n.createdAt).toISOString(),
  }));
  console.log("findBids",bidders);
  return bidders;
  
};
