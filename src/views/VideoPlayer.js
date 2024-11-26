// src/views/VideoPlayer.js
import Button from '@enact/sandstone/Button';
import { MediaControls } from '@enact/sandstone/MediaPlayer';
import VideoPlayer from '@enact/sandstone/VideoPlayer';
import { useCallback, useRef, useState } from 'react';
import './VideoPlayer.css'; // CSS 파일 추가

const SelectableVideoPlayer = ({ video, onClose, onPlay }) => {
    const videoRef = useRef(null);
    const [selection, setSelection] = useState([]);

    const handleToggleSelection = useCallback(() => {
        const { currentTime } = videoRef.current.getMediaState();
        if (selection.length !== 1) {
            setSelection([currentTime]);
        } else {
            setSelection([selection[0], currentTime].sort((a, b) => a - b));
        }
    }, [selection]);

    const handleTimeUpdate = useCallback(() => {
        if (selection.length === 2) {
            const [selectionStart, selectionEnd] = selection;
            const { currentTime } = videoRef.current.getMediaState();
            if (currentTime > selectionEnd || currentTime < selectionStart) {
                videoRef.current.seek(selectionStart);
            }
        }
    }, [selection]);

    const handleSeekOutsideSelection = useCallback((ev) => {
        ev.preventDefault();
        if (selection.length === 2) {
            const [selectionStart, selectionEnd] = selection;
            const { time: currentTime } = ev;
            if (currentTime < selectionStart) {
                videoRef.current.seek(selectionStart);
            } else if (currentTime > selectionEnd) {
                videoRef.current.seek(selectionEnd);
            }
        }
    }, [selection]);

    const setVideo = (video) => {
        videoRef.current = video;
    };

    const selecting = selection.length === 1;

    return (
        <div className="video-modal"> {/* 모달 스타일 적용 */}
            <VideoPlayer
                loop
                onSeekOutsideSelection={handleSeekOutsideSelection}
                onTimeUpdate={handleTimeUpdate}
                selection={selection}
                ref={setVideo}
                style={{ width: '100%', height: '100%' }} // 전체 화면 차지
            >
                <MediaControls>
                    <Button onClick={handleToggleSelection} selected={selecting}>
                        {selecting ? 'Play Loop' : 'Set End Time'}
                    </Button>
                    <Button onClick={onPlay}>재생</Button> {/* 재생 버튼 추가 */}
                </MediaControls>
                <source src={video.src} type="video/mp4" />
            </VideoPlayer>
            <Button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1001 }}>
                X
            </Button>
        </div>
    );
};

export default SelectableVideoPlayer;
