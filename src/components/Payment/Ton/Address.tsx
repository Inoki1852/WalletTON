import React from 'react';
import './PaymentOnTon.css';
import { useTonAddress } from "@tonconnect/ui-react";

const Address: React.FC = () => {
    const userFriendlyAddress = useTonAddress();
    const rawAddress = useTonAddress(false);

    return <div className="payment-info">
        {userFriendlyAddress && (
            <>
                <p>Connected TON address</p>
                <p>User-friendly address: {userFriendlyAddress}</p>
                <p>Raw address: {rawAddress}</p>
            </>
        )}
    </div>;
};

export default Address;
