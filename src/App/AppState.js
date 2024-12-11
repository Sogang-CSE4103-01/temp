/* eslint-disable */
import {useCallback, useEffect} from 'react';
import * as domEvents from '../constants/domEvents';
import debugLog from '../libs/log';
import {closeApp, isTVBrowser, reload} from '../libs/utils';
import { useContext } from 'react';
import { PanelContext } from '../views/Context';

const useVisibleChangeHandler = () =>
	useCallback(() => {
		const {hidden} = document;
		debugLog('VISIBILITY_CHANGE', {hidden});
	}, []);

const useLocaleChangeHandler = () =>
	useCallback(() => {
		debugLog('LOCALE_CHANGE', {});
		reload();
	}, []);

const useHighContrastChangeHandler = setSkinVariants =>
	useCallback(() => {
		debugLog('HIGH_CONTRAST_CHANGE', {});
		setSkinVariants({
			highContrast: window.webOSSystem.highContrast === 'on'
		});
	}, [setSkinVariants]);

export const useBackHandler = () => {
	const { setPanelData } = useContext(PanelContext); // PanelContext에서 setPanelData를 가져옵니다.
		
	return useCallback(() => {
		debugLog('BACK[I]', {});
		setPanelData(prev => {
			if (prev.length > 1) {
				return prev.slice(0, -1); // 마지막 패널 제거
			}
			return prev; // 패널이 하나만 남아있다면 변경하지 않음
		});
	}, [setPanelData]);
};

export const useCloseHandler = () =>
	useCallback(() => {
		debugLog('CLOSE_X[I]', {});
		closeApp();
	}, []);

// Add all document events here
export const useDocumentEvent = setSkinVariants => {
	const handleVisibilitychange = useVisibleChangeHandler();
	const handleHighContrastChange =
		useHighContrastChangeHandler(setSkinVariants);
	const handleLocaleChange = useLocaleChangeHandler();

	useEffect(() => {
		const events = {
			[domEvents.VISIBILITY_CHANGE]: handleVisibilitychange,
			[domEvents.WEBOS_HIHG_CONTRAST_CHANGE]: handleHighContrastChange,
			[domEvents.WEBOS_LOCALE_CHANGE]: handleLocaleChange
		};

		if (isTVBrowser()) {
			for (const event in events) {
				document.addEventListener(event, events[event]);
			}
		}

		return () => {
			if (isTVBrowser()) {
				for (const event in events) {
					document.removeEventListener(event, events[event]);
				}
			}
		};
	}, [handleVisibilitychange, handleHighContrastChange, handleLocaleChange]);
};

// Add functions to subscribe luna APIs for general usage here
export const useSubscriptions = () => {
	useProcStat();
};
