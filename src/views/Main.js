/* eslint-disable */
import React, { useCallback, useContext, useState } from 'react';
import ImageItem from '@enact/sandstone/ImageItem';
import Scroller from '@enact/sandstone/Scroller';
import Button from '@enact/sandstone/Button';
import Item from '@enact/sandstone/Item';
import Icon from '@enact/sandstone/Icon';
import TabLayout, { Tab } from '@enact/sandstone/TabLayout';
import { Header, Panel } from '@enact/sandstone/Panels';
import { scaleToRem } from '@enact/ui/resolution';
import { useMainState } from './MainState'; // 비디오 데이터를 가져오기 위한 훅
import SystemMonitor from './systemMonitor';
import useLogOut from './LogoutState';
import { PanelContext } from './Context'; // PanelContext 가져오기
import Popup from '@enact/sandstone/Popup'; // 팝업 컴포넌트 가져오기


const tabsWithIcons = [
	{ title: 'Home', icon: 'home' },
	{ title: 'Button', icon: 'gear' },
	{ title: 'Item', icon: 'trash' },
	{ title : "ProcState", icon : 'tvguidefvp'},
	{ title : "Log Out", icon : "logout"}
];

const Main = (props) => {
    const { setPanelData } = useContext(PanelContext);
    const { videoData, loadWatchTime, loadMore, loading} = useMainState(); // 비디오 데이터 가져오기 및 시청 시간 로드

    const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태 관리
    const [selectedVideo, setSelectedVideo] = useState(null); // 선택된 비디오 관리
    
	
    const handleClick = useCallback(
        index => () => {
            setSelectedVideo(videoData[index]); // 선택된 비디오 설정
            setIsPopupOpen(true); // 팝업 열기
        },
        [videoData]
    );

    const handlePopupConfirm = () => {
        const savedTime = loadWatchTime(selectedVideo.id); // 저장된 시청 시간 가져오기
        const startTime = 1; // 시청 시간이 있다면 1, 없다면 0
		console.log("aaa", startTime);

        //resetPage();
        //console.log("pop up", Page);

        // 비디오 재생 패널로 이동
        setPanelData(prev => [...prev, { name: 'videoPlay', data: { video: selectedVideo , startTime } }]);
        setIsPopupOpen(false); // 팝업 닫기
    };

	const {
        isLoggedOut,
        setUsername,
        setPassword,
        handleLogOut
    } = useLogOut();
    
	/*
	const handleClick = useCallback(
		index => () => {
			// 비디오 재생 패널로 이동
			console.log('Selected Video:', videoData[index]); // 클릭한 비디오 정보 로그
			setPanelData(prev => [...prev, { name: 'videoPlay', data: { video: videoData[index] } }]);
		},
		[setPanelData, videoData]
	);*/

    const handlePopupCancel = () => {
		// 비디오를 처음부터 재생
		const startTime = 0;
		console.log("bbb", startTime);
		setPanelData(prev => [...prev, { name: 'videoPlay', data: { video: selectedVideo, startTime } }]);
		setIsPopupOpen(false); // 팝업 닫기
	};

    // 비디오 컴포넌트 렌더링
    const videoItems = videoData.map(video => (
        <ImageItem
            inline
            key={video.id}
            label={video.title} // 비디오 제목을 레이블로 사용
            src={video.thumbnail} // 비디오 썸네일
            style={{
                width: scaleToRem(768),
                height: scaleToRem(588)
            }}
            onClick={handleClick(video.id - 1)} // 클릭 시 팝업 열기
        >
            {video.title} {/* 비디오 제목을 표시 */}
        </ImageItem>
    ));

	return (
		<Panel {...props}>
			<Header title="Sandstone TabLayout" subtitle="Basic TabLayout" />
			<TabLayout>
				<Tab title={tabsWithIcons[0].title} icon={tabsWithIcons[0].icon}>
					<Scroller>{videoItems.length > 0 ? videoItems : '비디오가 없습니다.'}
                    <Button onClick={loadMore} disabled={loading}>
                        {loading ? 'Loading...' : 'More'}
                    </Button>
                    </Scroller>
				</Tab>
				<Tab title={tabsWithIcons[1].title} icon={tabsWithIcons[1].icon}>
					<Button icon="demosync">Button 1</Button>
					<Button icon="demosync">Button 2</Button>
					<Button icon="demosync">Button 3</Button>
					<Button icon="demosync">Button 4</Button>
					<Button icon="demosync">Button 5</Button>
				</Tab>
				<Tab title={tabsWithIcons[2].title} icon={tabsWithIcons[2].icon}>
					<Item slotBefore={<Icon>playcircle</Icon>}>Single Item</Item>
				</Tab>
				<Tab title={tabsWithIcons[3].title} icon={tabsWithIcons[3].icon}>
					<SystemMonitor/>
				</Tab>
				<Tab title={tabsWithIcons[4].title} icon={tabsWithIcons[4].icon}>
                    <Button onClick={handleLogOut} >
                        Log Out
                    </Button>
                </Tab>
			</TabLayout>

			{/* 팝업 추가 */}
            <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                <h2>이전 시청 기록부터 보시겠습니까?
                    <h5 style={{ fontSize: '0.8rem', margin: 0 }}>
                        '아니오'를 선택할 경우 시청기록이 저장되지 않습니다,
                    </h5>
                </h2>
                <Button onClick={handlePopupConfirm}>예</Button>
                <Button onClick={handlePopupCancel}>아니오</Button>
            </Popup>
		</Panel>
	);
};

export default Main;
