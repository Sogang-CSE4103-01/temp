/* eslint-disable */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {useProcStat, useUnitList} from '../hooks/useData';
import ImageItem from '@enact/sandstone/ImageItem';
import Scroller from '@enact/sandstone/Scroller';
import Button from '@enact/sandstone/Button';
import Item from '@enact/sandstone/Item';
import Icon from '@enact/sandstone/Icon';
import Input, { InputField } from '@enact/sandstone/Input'; // Input 컴포넌트 가져오기
import TabLayout, { Tab } from '@enact/sandstone/TabLayout';
import { Header, Panel } from '@enact/sandstone/Panels';
import { scaleToRem } from '@enact/ui/resolution';
import { useMainState } from './MainState'; // 비디오 데이터를 가져오기 위한 훅
import { useWatchedVideos } from './useWatchedVideos';
import SystemMonitor from './systemMonitor';
import useLogOut from './LogoutState';
import { PanelContext } from './Context'; // PanelContext 가져오기
import Popup from '@enact/sandstone/Popup'; // 팝업 컴포넌트 가져오기
import { getUserId } from './address'; // config에서 setUserId 가져오기
import { QRCodeCanvas } from 'qrcode.react'; // 또는 QRCodeSVG


const tabsWithIcons = [
	{ title: 'Home', icon: 'home' },
	{ title: 'Button', icon: 'gear' },
	{ title: 'Item', icon: 'trash' },
	{ title: "ProcState", icon: 'tvguidefvp' },
	{ title: "Log Out", icon: "logout" },
	{ title: "Watching video", icon: "liveplay" },
	{ title: "Playlist", icon: "demosync" },
    { title: "Upload", icon: "folderupper"},
];

const Main = (props) => {
	const { setPanelData } = useContext(PanelContext);
	const { videoData, loadWatchTime, loadMore, loading, generateFilteredVideoData} = useMainState(); // 비디오 데이터 가져오기 및 시청 시간 로드
	const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태 관리
	const [selectedVideo, setSelectedVideo] = useState(null); // 선택된 비디오 관리
	const userId = getUserId();
	console.log("현재유저", userId);
	const { watchedVideos, fetchWatchedVideos } = useWatchedVideos(userId); // 시청 중인 비디오 가져오기
	const [activeTab, setActiveTab] = useState(0); // 활성 탭 상태 관리
    const [qrUrl, setQrUrl] = useState(''); //QR 코드용
	const [filteredVideos, setFilteredVideos] = useState([]); // 필터링된 비디오 저장
	const [searchString, setSearchString] = useState(''); // 검색 문자열 상태 관리


    // 필터링된 비디오 가져오기
    const fetchFilteredVideos = async () => {
        const filtered = await generateFilteredVideoData(searchString);
        setFilteredVideos(filtered); // 필터링된 비디오 저장
    };

	/*useEffect(() => {
	}, [filteredVideos]);*/


	const handleSearchChange = async (event) => {
		const value = event.value; // event.value를 사용
		setSearchString(value); // 입력된 검색 문자열 상태 업데이트
	
		if (value) {
			console.log("검색중", value);
			// 비디오 데이터 필터링
			const filtered = await generateFilteredVideoData(value); // await을 사용하여 결과를 기다립니다.
			setFilteredVideos(filtered); // 필터링된 비디오 저장
		} else {
			setFilteredVideos([]); // 입력이 없을 경우 필터링된 비디오 초기화
		}
	};
	
	
	const handleClick = useCallback(
		index => () => {
			setSelectedVideo(videoData[index]); // 선택된 비디오 설정
			setIsPopupOpen(true); // 팝업 열기
		},
		[videoData]
	);

	const fhandleClick = useCallback(
		index => () => {
			const selectedVideo = filteredVideos.find(video => video.id === index + 1); // index + 1과 같은 video.id를 가진 비디오 찾기
			if (selectedVideo) {
				setSelectedVideo(selectedVideo); // 선택된 비디오 설정
				setIsPopupOpen(true); // 팝업 열기
			}
		},
		[filteredVideos] // filteredVideos를 의존성으로 추가
	);

	const whandleClick = useCallback(
		index => () => {
			const selectedVideo = watchedVideos.find(video => video.id === index + 1); // index + 1과 같은 video.id를 가진 비디오 찾기
			if (selectedVideo) {
				setSelectedVideo(selectedVideo); // 선택된 비디오 설정
				setIsPopupOpen(true); // 팝업 열기
			}
		},
		[watchedVideos] // filteredVideos를 의존성으로 추가
	);
	

	
	const handlePopupConfirm = () => {
		const savedTime = loadWatchTime(selectedVideo.id); // 저장된 시청 시간 가져오기
		const startTime = 1; // 시청 시간이 있다면 1, 없다면 0
		console.log("aaa", startTime);
		console.log("재생할 비디오 ID:", selectedVideo.id);
		// 비디오 재생 패널로 이동
		setPanelData(prev => [...prev, { name: 'videoPlay', data: { video: selectedVideo, startTime } }]);
		setIsPopupOpen(false); // 팝업 닫기
	};

	const {
		isLoggedOut,
		setUsername,
		setPassword,
		handleLogOut
	} = useLogOut();

	const handlePopupCancel = () => {
		// 비디오를 처음부터 재생
		const startTime = 0;
		
		console.log("bbb", startTime);
		setPanelData(prev => [...prev, { name: 'videoPlay', data: { video: selectedVideo, startTime } }]);
		setIsPopupOpen(false); // 팝업 닫기
	};



	// 비디오 컴포넌트 렌더링
	const videoItems = (searchString.length === 0 ? videoData : filteredVideos).map(video => {
	
		// 조건에 따라 클릭 핸들러를 선택
		const handleClickFunction = searchString.length === 0 ? handleClick(video.id - 1) : fhandleClick(video.id - 1);
	
		return (
			<ImageItem
				inline
				key={video.id}
				label={video.title} // 비디오 제목을 레이블로 사용
				src={video.thumbnail} // 비디오 썸네일
				style={{
					width: scaleToRem(768),
					height: scaleToRem(588)
				}}
				onClick={handleClickFunction} // 클릭 시 적절한 핸들러 사용
			>
				{video.title} {/* 비디오 제목을 표시 */}
			</ImageItem>
		);
	});
	
	

	const wvideoItems = watchedVideos.map(video => {
		console.log("시청한 비디오 ID:", video.id); // 시청한 비디오 ID를 콘솔에 출력
	
		return (
			<ImageItem
				inline
				key={video.id}
				label={video.title} // 비디오 제목을 레이블로 사용
				src={video.thumbnail} // 비디오 썸네일
				style={{
					width: scaleToRem(768),
					height: scaleToRem(588)
				}}
				onClick={whandleClick(video.id - 1)} // 클릭 시 팝업 열기
			>
				{video.title} {/* 비디오 제목을 표시 */}
			</ImageItem>
		);
	});
	


	const userVideoItems = videoData.filter(video => video.id % userId === 0).map(video => (
		<ImageItem
			inline
			key={video.id}
			label={video.title}
			src={video.thumbnail}
			style={{
				width: scaleToRem(768),
				height: scaleToRem(588)
			}}
			onClick={handleClick(video.id - 1)} // 클릭 시 팝업 열기
		>
			{video.title}
		</ImageItem>
	));

    const generateRandomURL = () => {
		const randomId = Math.floor(Math.random() * 100000); // 0~99999 사이의 랜덤 숫자
		const randomUrl = `http://192.168.0.2:8080/register`;
		setQrUrl(randomUrl);
	};


	return (
		<Panel
			{...props}
			style={{
				backgroundImage: 'linear-gradient(to bottom, #00006a, #000000)', // 어두운 파랑(#00008b)에서 검정(#000000)으로 그라데이션
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				height: '100%', // 패널 전체를 덮기 위해 높이 지정
			}}
		>
			<Header title="LLG" subtitle={`user ${userId}`} />
			<TabLayout >
			<Tab title={tabsWithIcons[0].title} icon={tabsWithIcons[0].icon}>
                    <InputField
                        type="text"
                        placeholder="검색"
                        value={searchString}
                        onChange={handleSearchChange}
                        
                    />
                    <Scroller>
                        {videoItems.length > 0 ? videoItems : '비디오가 없습니다.'}
                        <Button onClick={loadMore} disabled={loading}>
                            {loading ? 'Loading...' : 'More'}
                        </Button>
                    </Scroller>
                </Tab>
				<Tab title={tabsWithIcons[5].title} icon={tabsWithIcons[5].icon} onTabClick={() => fetchWatchedVideos()}>
					<Scroller>{wvideoItems.length > 0 ? wvideoItems : '비디오가 없습니다.'}</Scroller>
				</Tab>

                <Tab title={tabsWithIcons[7].title} icon={tabsWithIcons[7].icon}>
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Button onClick={generateRandomURL}>upload video</Button>
                        {qrUrl ? (
                            <div style={{ marginTop: '20px' }}>
                                <p>생성된 URL: {qrUrl}</p>
                                <QRCodeCanvas value={qrUrl} size={256} />
                            </div>
                        ) : (
                            <p>QR 코드를 생성하려면 버튼을 클릭하세요.</p>
                        )}
                    </div>
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
					<SystemMonitor />
				</Tab>
				<Tab title={tabsWithIcons[4].title} icon={tabsWithIcons[4].icon}>
					<Button onClick={handleLogOut}>
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


/*
import Alert from '@enact/sandstone/Alert';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import {Header, Panel} from '@enact/sandstone/Panels';
import {usePopup} from './MainState_';

import css from './Main.module_.less';
import $L from '@enact/i18n/$L';
import {useProcStat} from '../hooks/useData';

const Main = props => {
	const procStat = useProcStat();
	const {isPopupOpen, handlePopupOpen, handlePopupClose, handleLaunchApp} =
		usePopup();

	return (
		<Panel {...props}>
			<Header title={$L('Enact Template')} />
			<BodyText>{$L('This is a main page of sample application.')}</BodyText>
			<Button onClick={handlePopupOpen} size="small" className={css.buttonCell}>
				{$L('Open Alert')}
			</Button>
			<BodyText>{`procStat : ${JSON.stringify(procStat)}`}</BodyText>
			<Alert type="overlay" open={isPopupOpen} onClose={handlePopupClose}>
				<span>{$L('This is an alert message.')}</span>
				<buttons>
					<Button
						size="small"
						className={css.buttonCell}
						onClick={handleLaunchApp}
					>
						Launch
					</Button>
					<Button
						size="small"
						className={css.buttonCell}
						onClick={handlePopupClose}
					>
						{$L('Close')}
					</Button>
				</buttons>
			</Alert>
		</Panel>
	);
};

export default Main;
*/