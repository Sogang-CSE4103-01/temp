/* eslint-disable */
import React, { useState, useEffect } from 'react';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import Scroller from '@enact/sandstone/Scroller';
import Popup from '@enact/sandstone/Popup';
import $L from '@enact/i18n/$L';
import css from './Main.module.less';
import { useCpu, useMem, useConfigs } from '../hooks/useData';
import { Chart as ChartJS, BarElement, LineElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(BarElement, LineElement, PointElement, Tooltip, Legend, CategoryScale, LinearScale);

const Status = () => {
    const data = useConfigs();
    const [data_cpu, setCpu] = useCpu({ returnValue: false });
    const [data_mem, setMem] = useMem({ returnValue: false });
    const [parsedData, setParsedData] = useState({
        cur_vmallocSize: '',
        init_vmallocSize: '',
        swapUsed: '',
        usable_memory: '',
        user: '',
        system: '',
        nice: '',
        idle: '',
    });

    const [showMemPopup, setShowMemPopup] = useState(false);
    const [showTvInfoPopup, setShowTvInfoPopup] = useState(false);
    const [showLineGraph, setShowLineGraph] = useState(false);

    const [cpuTimeline, setCpuTimeline] = useState([]);
    const [memTimeline, setMemTimeline] = useState([]);

    const setData = async () => {
        setCpu();
        setMem();
    };

    useEffect(() => {
        setData();
    }, []);

    const renderTVInfo = () => (
        <div>
            <h2>TV Information</h2>
            {data && (
                <ul>
                    <li><strong>Model Name:</strong> {data.modelName}</li>
                    <li><strong>Firmware Version:</strong> {data.firmwareVersion}</li>
                    <li><strong>UHD:</strong> {data.UHD}</li>
                    <li><strong>SDK Version:</strong> {data.sdkVersion}</li>
                </ul>
            )}
        </div>
    );

    useEffect(() => {
        if (data_cpu.returnValue) {
            const statArray = data_cpu.stat || [];
            const cpuLine = statArray.find(line => line.startsWith('cpu '));
            if (cpuLine) {
                const [, user, system, nice, idle] = cpuLine.split(/\s+/).map(Number);
                setParsedData(prev => ({
                    ...prev,
                    user,
                    system,
                    nice,
                    idle,
                }));
                setCpuTimeline(prev => [...prev, { user, system, nice, idle }]);
            }
        }
    }, [data_cpu]);

    useEffect(() => {
        if (data_mem.returnValue) {
            const vmallocInfo = data_mem.vmallocInfo || {};
            const curVmallocSize = vmallocInfo.cur_vmallocSize || 0;
            const initVmallocSize = vmallocInfo.init_vmallocSize || 0;
            const swapUsed = data_mem.swapUsed || 0;
            const usableMemory = data_mem.usable_memory || 0;

            setParsedData(prev => ({
                ...prev,
                cur_vmallocSize: curVmallocSize,
                init_vmallocSize: initVmallocSize,
                swapUsed,
                usable_memory: usableMemory,
            }));
            setMemTimeline(prev => [...prev, { cur_vmallocSize: curVmallocSize, usable_memory: usableMemory }]);
        }
    }, [data_mem]);

    const MemBarData = {
        labels: ['cur_vmallocSize', 'swapUsed', 'usable_memory'],
        datasets: [
            {
                label: 'Memory Usage',
                data: [parsedData.cur_vmallocSize, parsedData.swapUsed, parsedData.usable_memory],
                //backgroundColor: 'rgba(75, 192, 192, 0.2)',
                //borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)', // cur_vmallocSize
                    'rgba(255, 159, 64, 0.2)', // swapUsed
                    'rgba(153, 102, 255, 0.2)', // usable_memory
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)', // cur_vmallocSize
                    'rgba(255, 159, 64, 1)', // swapUsed
                    'rgba(153, 102, 255, 1)', // usable_memory
                ],
                borderWidth: 1,
            },
        ],
    };

    const CpuBarData = {
        labels: ['user', 'system', 'nice', 'idle'],
        datasets: [
            {
                label: 'CPU Usage',
                data: [parsedData.user, parsedData.system, parsedData.nice, parsedData.idle],
                //backgroundColor: 'rgba(54, 162, 235, 0.2)',
                //borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)', // user
                    'rgba(54, 162, 235, 0.2)', // system
                    'rgba(255, 206, 86, 0.2)', // nice
                    'rgba(75, 192, 192, 0.2)', // idle
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)', // user
                    'rgba(54, 162, 235, 1)', // system
                    'rgba(255, 206, 86, 1)', // nice
                    'rgba(75, 192, 192, 1)', // idle
                ],
                borderWidth: 1,
            },
        ],
    };

    const LineGraphData = {
        labels: cpuTimeline.map((_, index) => `${index + 1}s`),
        datasets: [
            {
                label: 'CPU User',
                data: cpuTimeline.map(data => data.user),
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
            },
            {
                label: 'Memory Usage',
                data: memTimeline.map(data => data.cur_vmallocSize),
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false,
            },
        ],
    };

    return (
        <Scroller direction="vertical">
            <BodyText>{$L('System Status')}</BodyText>

            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
           
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <div style={{
                    height: '600px',
                    width: '700px',
                }}>
                    <Bar data={MemBarData} />
                </div>
                <div style={{
                    height: '600px',
                    width: '700px',
                }}>
                    <Bar data={CpuBarData} />
                </div>
            </div>

            {/* 버튼 섹션 */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '20px 0',
                gap: '10px',
            }}>
                <Button onClick={() => setShowMemPopup(true)}>{$L('Show Memory Info')}</Button>
                <Button onClick={() => setShowTvInfoPopup(true)}>{$L('Show TV Info')}</Button>
                {/*<Button onClick={() => setShowLineGraph(true)}>{$L('Show Line Graph')}</Button> */}
                <Button onClick={setData}>{$L('Reload Status')}</Button>
            </div>
        </div>

            <Popup open={showMemPopup} onClose={() => setShowMemPopup(false)}>
                <h2>Memory Details</h2>
                <BodyText>{`Mem_cur_vmallocSize: ${parsedData.cur_vmallocSize}`}</BodyText>
                <BodyText>{`Mem_init_vmallocSize: ${parsedData.init_vmallocSize}`}</BodyText>
                <BodyText>{`Mem_swapUsed: ${parsedData.swapUsed}`}</BodyText>
                <BodyText>{`Mem_usable_memory: ${parsedData.usable_memory}`}</BodyText>
            </Popup>

            <Popup open={showTvInfoPopup} onClose={() => setShowTvInfoPopup(false)}>
                {renderTVInfo()}
            </Popup>

            {/*}
            <Popup open={showLineGraph} onClose={() => setShowLineGraph(false)}>
                <Line data={LineGraphData} />
            </Popup> */}
        </Scroller>
    );
};

export default Status;


