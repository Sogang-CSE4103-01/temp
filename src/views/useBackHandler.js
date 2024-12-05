// useBackHandler.js
import { useContext } from 'react';
import { PanelContext } from './Context';

const useBackHandler = () => {
    const { panelData, setPanelData } = useContext(PanelContext);
    
    return () => {
        if (panelData.length > 1) {
            setPanelData(prev => prev.slice(0, -1)); // 마지막 패널 제거
            return true; // 백 이벤트를 처리했음을 나타냄
        }
        return false; // 백 이벤트를 처리하지 않음
    };
};

export default useBackHandler;
