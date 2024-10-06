'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { ExplorerLink } from '../cluster/cluster-ui';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { useFusogenProgram } from './fusogen-data-access';
import { FusogenCreate, FusogenProgram } from './fusogen-ui'

export default function FusogenFeature() {
  const { publicKey } = useWallet();
  const { programId } = useFusogenProgram();

  return publicKey ? (
    <div>
      <AppHero
        title={<img src='/fusogen-text-wh.png' alt="Fusogen Logo" />} // Use the SVG logo here
        subtitle=''
      >
        <p className="mb-6">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
        <FusogenCreate />
      </AppHero>
      <FusogenProgram />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton className="btn btn-primary" />
        </div>
      </div>
    </div>
  );
}
