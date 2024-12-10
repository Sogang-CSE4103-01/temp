/* eslint-disable */
import React from 'react';
import { useProcStat, useUnitList } from '../hooks/useData';
import { Panel, Header } from '@enact/sandstone/Panels';
import { Scroller } from '@enact/sandstone/Scroller';

const SystemMonitor = () => {
    const procStat = useProcStat();
    const unitList = useUnitList();

    return (
        <Panel>
            <Header title="System Monitor" />
            <Scroller>
            <h3>CPU 사용량: {procStat.cpu_usage ? `${procStat.cpu_usage}%` : '정보 없음'}</h3>
                <h3>메모리 사용량: {unitList.memory_usage ? `${unitList.memory_usage}MB` : '정보 없음'}</h3>
            </Scroller>
        </Panel>
    );
};

export default SystemMonitor;
