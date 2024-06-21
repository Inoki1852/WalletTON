import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TonConnectButton, useTonConnectUI, useTonWallet, CHAIN, SendTransactionRequest } from "@tonconnect/ui-react";
import { useTelegram } from '../../../hooks/useTelegram';
import Address from './Address';
import Wallet from './Wallet';
import TransactInfo from './TransactInfo';

const PaymentOnTon: React.FC = () => {
    const PAYMENT_AMOUNT = 200000000;
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();
    const { MainButton, disableMainButton } = useTelegram();
    const [bocFromTransact, setBocFromTransact] = useState<string>("");

    const transaction: SendTransactionRequest = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
            address: "0QALFC4ajvwOifHOsCabklwX0_p12DX9hkAsPIQmY0ZutRkI",
            amount: PAYMENT_AMOUNT.toString(),
        }],
        network: CHAIN.TESTNET
    };

    const sendTransaction = useCallback(async () => {
        if (tonConnectUI.connected === false) {
            return;
        }

        try {
            const result = await tonConnectUI.sendTransaction(transaction, {
                modals: ['before', 'success', 'error'],
                notifications: ['before', 'success', 'error']
            });

            setBocFromTransact(result.boc);
        } catch (error) {
            console.log(error);
        }
    }, [tonConnectUI, transaction]);

    const navigate = useNavigate();

    useEffect(() => {
        if (wallet === null) {
            disableMainButton();
        }

        if (bocFromTransact === "") {
            MainButton.setText("Pay for a subscription");
            MainButton.onClick(sendTransaction);
            MainButton.show();
        }
    }, [wallet, MainButton, sendTransaction, disableMainButton, bocFromTransact]);

    const goHome = useCallback(() => {
        disableMainButton();
        navigate("/");
    }, [disableMainButton, navigate]);

    return (
        <div>
            {bocFromTransact === "" ?
                <div className="component PaymentOnTon-body">
                    <header>
                        <TonConnectButton style={{ float: "right", margin: "20px" }} />
                    </header>
                    <div className="wrapper">
                        <div>
                            Payment amount: {PAYMENT_AMOUNT / 1000000000} TON
                        </div>
                        <Address />
                        <br />
                        <Wallet />
                    </div>
                </div>
                :
                <div className="wrapper">
                    <TransactInfo boc={bocFromTransact} offClickCallback={sendTransaction} />
                </div>
            }
        </div>
    );
};

export default PaymentOnTon;
