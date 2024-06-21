declare global {
    interface Window {
        Telegram: any;
    }
}

const tg = window.Telegram.WebApp;

export function useTelegram() {
    const disableMainButton = () => {
        tg.MainButton.setText('Main button');
        tg.MainButton.onClick(() => { });
        tg.MainButton.hide();
    };

    return {
        tg,
        BackButton: tg.BackButton,
        MainButton: tg.MainButton,
        user: tg.initDataUnsafe?.user,
        disableMainButton,
    };
}
