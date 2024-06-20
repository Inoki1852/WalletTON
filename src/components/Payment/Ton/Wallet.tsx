import React from 'react';
import { useTonWallet } from '@tonconnect/ui-react';

const Wallet: React.FC = () => {
    const wallet = useTonWallet();

    return <div className='payment-info'>
        {wallet && (
            <>
                <p>Wallet Info</p>
                <p>Connected wallet: {wallet.device.appName} </p>
                <p>Device: {wallet.device.platform}</p>
            </>
        )}
    </div>;
};

export default Wallet;
