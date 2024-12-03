/*jest.mock('../libs/log');
import '@testing-library/jest-dom';
import {act} from '@testing-library/react';
import debugLog from '../libs/log';
import launch from '../libs/testutils';

beforeEach(() => {
	global.CustomEvent = class CustomEvent extends Event {
		constructor(event, params) {
			super(event, params);
			this.detail = params?.detail || null;
		}
	};

	window.webOSSystem = {
		PmLogString: jest.fn(),
		close: jest.fn(),
		setWindowOrientation: jest.fn()
	};
});

afterEach(() => {
	debugLog.mockRestore();
});

describe('The app handles document events.', () => {
	test.skip('The app is reloaded when locale has changed.', async () => {
		const originalLocation = window.location;
		delete window.location;
		window.location = {
			href: 'http://localhost/',
			replace: jest.fn(),
		};
		await launch();
		const event = new CustomEvent('webOSLocaleChange');
		await act(async () => {
			await document.dispatchEvent(event);
		});
		expect(window.location.replace).toBeCalledWith(
			'http://localhost/index.html'
		);
		window.location = originalLocation;
	});
});*/
