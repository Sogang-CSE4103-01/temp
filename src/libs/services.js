/*
import request from '../libs/request';

export const mem = params => request('luna://com.webos.memorymanager')(params);

export const sam = params =>
	request('luna://com.webos.applicationManager')(params); */

import request from '../libs/request';

export const sys = request('luna://com.webos.service.tv.systemproperty');
export const getSystemInfo = params =>
	sys({method: 'getSystemInfo', ...params});

export const sam = request('luna://com.webos.applicationManager');
export const launch = parameters => sam({method: 'launch', parameters});

export const mem = request('luna://com.webos.service.sdkagent/collector');
export const getStat = params =>
	mem({method: 'getData', ...params});