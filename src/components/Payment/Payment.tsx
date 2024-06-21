import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import PaymentOnTon from './Ton/PaymentOnTon';

const Payment: React.FC = () => {
    const { BackButton, MainButton, disableMainButton } = useTelegram();
    const navigate = useNavigate();

    useEffect(() => {
        if (BackButton.isVisible === false) {
            BackButton.show();
        }

        BackButton.onClick(() => {
            if (MainButton.isVisible) {
                disableMainButton();
            }
            navigate("/");
        });
    }, [BackButton, MainButton, disableMainButton, navigate]);

    return (
        <div className="component">
            <PaymentOnTon />
        </div>
    );
};

export default Payment;
