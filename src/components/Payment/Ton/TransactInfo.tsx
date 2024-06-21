import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { Cell } from '@ton/core';

interface TransactInfoProps {
    boc: string;
    offClickCallback: () => void;
}

const TransactInfo: React.FC<TransactInfoProps> = ({ boc, offClickCallback }) => {
    const TIME_FOR_REDIRECT_IN_SECONDS = 15;
    const [countdown, setCountdown] = useState<number>(TIME_FOR_REDIRECT_IN_SECONDS);
    const [hashTransact, setHashTransact] = useState<string>("");
    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    const { MainButton, disableMainButton } = useTelegram();
    const navigate = useNavigate();

    const goHome = useCallback(() => {
        disableMainButton();
        navigate("/");
    }, [disableMainButton, navigate]);

    useEffect(() => {
        const getHash = async () => {
            try {
                const cell = Cell.fromBase64(boc);
                const hashBuffer = await cell.hash();
                setHashTransact(hashBuffer.toString('base64'));
            } catch (error) {
                console.error("Failed to get hash from BOC", error);
            }
        };

        getHash();
    }, [boc]);

    useEffect(() => {
        MainButton.offClick(offClickCallback);

        MainButton.setText("Go home page");
        MainButton.onClick(goHome);
        MainButton.show();

        return () => {
            MainButton.offClick(goHome);
        }
    }, [MainButton, goHome, offClickCallback]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
        }, 1000);

        if (countdown === 0) {
            goHome();
        }

        return () => {
            clearInterval(timer);
        };
    }, [countdown, goHome]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(hashTransact);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 3000);
        } catch (error) {
            console.error("Failed to copy hash to clipboard", error);
        }
    };

    return (
        <div className="component PaymentOnTon-body payment-info">
            <h2>Thank you for staying with us</h2>
            <p>Your hash of transaction:</p>
            <p onClick={copyToClipboard} style={{ cursor: 'pointer' }}>{hashTransact}</p>
            <br />
            <br />
            <div className={`copy-success-message ${copySuccess ? 'show' : ''}`}>
                Hash copied
            </div>
            <p className='annotation'>Redirecting to home page in {countdown} seconds...</p>
        </div>
    );
};

export default TransactInfo;
