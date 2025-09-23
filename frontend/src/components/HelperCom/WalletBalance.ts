import { useEffect } from 'react';
import { useAccount, useBalance, useBlockNumber } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';

export const WalletBalance = () => {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: balance,  refetch } = useBalance({
    address,
    chainId: bscTestnet.id,
  });

  useEffect(() => {
    if (blockNumber) {
      refetch();
    }
  }, [blockNumber, refetch]);

  const formattedBalance = balance?.formatted
    ? parseFloat(balance.formatted).toFixed(3) 
    : undefined;
    
  return { symbol:balance?.symbol ,
  formate:formattedBalance
  }
};
