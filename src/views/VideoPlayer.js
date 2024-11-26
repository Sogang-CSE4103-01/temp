import React, { useRef, useContext, useEffect } from 'react';
import Button from '@enact/sandstone/Button';
import { MediaControls } from '@enact/sandstone/MediaPlayer';
import VideoPlayer from '@enact/sandstone/VideoPlayer';
import { Header, Panel } from '@enact/sandstone/Panels';
import { PanelContext } from './Context'; // PanelContext 가져오기
import { useMainState } from './MainState'; // MainState에서 가져오기
import './VideoPlayer.css'; // CSS 파일 추가

const SelectableVideoPlayer = ({ video }) => {
    const videoRef = useRef(null);
    const { loadWatchTime, saveWatchTime } = useMainState(); // 시청 시간 관리 함수 가져오기
    const { setPanelData } = useContext(PanelContext); // 패널 데이터 설정 함수 가져오기

    const handleBack = () => {
        const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
        if (videoNode) {
            const currentTime = videoNode.currentTime; // 현재 시간 가져오기
            saveWatchTime(video.id, currentTime); // 현재 시간을 저장
            console.log('Current time saved before going back:', currentTime);
        }
        setPanelData(prev => prev.slice(0, -1)); // 이전 패널로 이동
    };

    const handleGoToDetails = () => {
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

    // 이어보기 버튼 클릭 시 호출되는 함수
    const handleResumeWatch = () => {
        const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
        if (videoNode) {
            const currentTime = videoNode.currentTime; // 현재 시간 가져오기
            saveWatchTime(video.id, currentTime); // 현재 시간을 저장
            console.log('Current time saved for video:', currentTime);
        }
    };

    // 비디오가 로드된 후 이어보기 시간에서 비디오 재생
    const handleLoadedData = () => {
        const savedTime = loadWatchTime(video.id); // 저장된 시간 불러오기
        const videoNode = videoRef.current.getVideoNode(); // 비디오 노드 가져오기
        if (videoNode && savedTime > 0) {
            videoNode.pause(); // 비디오 멈춤
            videoNode.currentTime = savedTime; // 저장된 시간으로 이동
            console.log('Video resumed from:', savedTime); // 로그 추가

            // 비디오 재생 시작
            videoNode.play(); // 비디오 재생 시작
        }
    };


    return (
        <Panel>
            <Header title={video.title} onClose={handleBack} /> {/* 뒤로가기 핸들러 추가 */}
            <div className="video-modal"> {/* 모달 스타일 적용 */}
                <VideoPlayer
                    loop
                    ref={videoRef}
                    style={{ width: '100%', height: '100%' }} // 전체 화면 차지
                    onEnded={handleVideoEnd} // 비디오 종료 시 핸들러 추가
                    onLoadedData={handleLoadedData} // 비디오가 로드된 후 호출
                >
                    <MediaControls>
                        <Button onClick={handleGoToDetails}>Go to Details</Button> {/* 디테일로 이동 버튼 */}
                        <Button onClick={handleResumeWatch}>Resume Watching</Button> {/* 이어보기 버튼 추가 */}
                    </MediaControls>
                    <source src={video.src} type="video/mp4" />
                </VideoPlayer>
            </div>
        </Panel>
    );
};

export default SelectableVideoPlayer;
