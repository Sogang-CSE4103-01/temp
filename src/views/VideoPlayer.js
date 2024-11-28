/* eslint-disable */
import React, { useRef, useContext } from 'react';
import Button from '@enact/sandstone/Button';
import { MediaControls } from '@enact/sandstone/MediaPlayer';
import VideoPlayer from '@enact/sandstone/VideoPlayer';
import { Header, Panel } from '@enact/sandstone/Panels';
import { PanelContext } from './Context'; // PanelContext 가져오기
import { useMainState } from './MainState'; // MainState에서 가져오기
import './VideoPlayer.css'; // CSS 파일 추가
import { useBackHandler } from '../App/AppState'; // useBackHandler 가져오기

const SelectableVideoPlayer = ({ video, startTime}) => {
    console.log('data is: ', video, startTime);
    const videoRef = useRef(null);
    const { loadWatchTime, saveWatchTime } = useMainState(); // 시청 시간 관리 함수 가져오기
    const { setPanelData } = useContext(PanelContext); // 패널 데이터 설정 함수 가져오기
    
    // 기존 useBackHandler를 사용하여 백 핸들러 정의
    const handleBack = useBackHandler();

    const handleGoToDetails = () => {
        const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
        if (videoNode) {
            const currentTime = videoNode.currentTime; // 현재 시간 가져오기
            saveWatchTime(video.id, currentTime); // 현재 시간을 저장
            console.log('Current time saved before going back:', currentTime);
        }
        setPanelData(prev => [...prev, { name: 'detail', data: { index: video.id } }]); // 디테일 패널로 이동
    };

    // 비디오가 종료될 때 현재 시간을 저장
    const handleVideoEnd = () => {
        const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
        if (videoNode) {
            const currentTime = videoNode.currentTime; // 현재 시간 가져오기
            saveWatchTime(video.id, currentTime); // 현재 시간을 저장
            console.log('Video ended. Resuming at:', currentTime);
        }
    };

    // 비디오가 로드된 후 이어보기 시간에서 비디오 재생
    const handleLoadedData = () => {
        const savedTime = loadWatchTime(video.id); // 저장된 시간 불러오기
        const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
        
        if (videoNode && savedTime > 0) {
            console.log('Resuming video from saved time:', savedTime);
            videoNode.currentTime = savedTime; // 저장된 시간으로 이동
            videoNode.play(); // 비디오 재생 시작
        }
    };

    // 처음부터 재생하는 핸들러
    const handlePlayFromStart = () => {
        const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
        
        if (videoNode) {
            console.log('Starting video from the beginning');
            videoNode.play(); // 비디오 재생 시작
        }
    };

    const setVideo = (video) => {
        videoRef.current = video; // 비디오 설정
    };

    return (
        <Panel>
            <Header 
                title={video.title} 
                onBack={() => {
                    const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
                    if (videoNode) {
                        const currentTime = videoNode.currentTime; // 현재 시간 가져오기
                        saveWatchTime(video.id, currentTime); // 현재 시간을 저장
                        console.log('Current time saved before going back:', currentTime);
                    }
                    handleBack(); // useBackHandler를 사용하여 패널 이동
                }} 
            />
            <div className="video-modal"> {/* 모달 스타일 적용 */}
                <VideoPlayer
                    loop
                    ref={setVideo}
                    style={{ width: '100%', height: '100%' }} // 전체 화면 차지
                    onEnded={handleVideoEnd} // 비디오 종료 시 핸들러 추가
                    onLoadedData={startTime > 0 ? handleLoadedData : handlePlayFromStart} // startTime에 따라 호출되는 핸들러 설정
                >
                    <MediaControls>
                        <Button onClick={handleGoToDetails}>Go to Details</Button> {/* 디테일로 이동 버튼 */}
                        <Button onClick={() => {
                            const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
                            if (videoNode) {
                                const currentTime = videoNode.currentTime; // 현재 시간 가져오기
                                saveWatchTime(video.id, currentTime); // 현재 시간을 저장
                                console.log('Current time saved for video:', currentTime);
                            }
                        }}>Resume Watching</Button> {/* 이어보기 버튼 추가 */}
                        <Button onClick={() => {
                            const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
                            if (videoNode) {
                                const currentTime = videoNode.currentTime; // 현재 시간 가져오기
                                saveWatchTime(video.id, currentTime); // 현재 시간을 저장
                                console.log('Current time saved before going back:', currentTime);
                            }
                            handleBack(); // 패널 이동
                        }}>Back</Button> {/* 뒤로가기 버튼 추가 */}
                    </MediaControls>
                    <source src={video.src} type="video/mp4" />
                </VideoPlayer>
            </div>
        </Panel>
    );
};

export default SelectableVideoPlayer;
