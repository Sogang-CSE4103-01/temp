import { useCallback, useState } from 'react';
import { sam } from '../libs/services';
import debugLog from '../libs/log';

// 로컬 이미지 불러오기 (src/assets에서)
import video1 from '../assets/video1.jpg';
import video2 from '../assets/video2.jpg';
import video3 from '../assets/video3.jpg';
import video4 from '../assets/video4.jpg';
import video5 from '../assets/video5.jpg';
import video6 from '../assets/video6.jpg';

// 비디오 정보를 관리하기 위한 데이터 타입
export const useMainState = () => {
	const [isPopupOpen, openPopup] = useState(false);
	const [videoData, setVideoData] = useState([
		{
			id: 1,
			title: "첫 번째 비디오",
			thumbnail: video1,
			src: 'http://media.w3.org/2010/05/video/movie_300.mp4'
		},
		{
			id: 2,
			title: "두 번째 비디오",
			thumbnail: video2,
			src: 'http://media.w3.org/2010/05/video/movie_300.mp4'
		},
		{
			id: 3,
			title: "세 번째 비디오",
			thumbnail: video3,
			src: 'https://example.com/video3.mp4'
		},
		{
			id: 4,
			title: "네 번째 비디오",
			thumbnail: video4,
			src: 'https://example.com/video4.mp4'
		},
		{
			id: 5,
			title: "다섯 번째 비디오",
			thumbnail: video5,
			src: 'https://example.com/video5.mp4'
		},
		{
			id: 6,
			title: "여섯 번째 비디오",
			thumbnail: video6,
			src: 'https://example.com/video6.mp4'
		},
		{
			id: 7,
			title: "일곱 번째 비디오",
			thumbnail: video6,
			src: 'https://example.com/video7.mp4'
		},
		{
			id: 8,
			title: "여덟 번째 비디오",
			thumbnail: video6,
			src: 'https://example.com/video8.mp4'
		},
		{
			id: 9,
			title: "아홉 번째 비디오",
			thumbnail: video6,
			src: 'https://example.com/video9.mp4'
		},
		{
			id: 10,
			title: "열 번째 비디오",
			thumbnail: video1,
			src: 'https://example.com/video10.mp4'
		},
		{
			id: 11,
			title: "열한 번째 비디오",
			thumbnail: video2,
			src: 'https://example.com/video11.mp4'
		},
		{
			id: 12,
			title: "열두 번째 비디오",
			thumbnail: video3,
			src: 'https://example.com/video12.mp4'
		},
		{
			id: 13,
			title: "열세 번째 비디오",
			thumbnail: video4,
			src: 'https://example.com/video13.mp4'
		},
		{
			id: 14,
			title: "열네 번째 비디오",
			thumbnail: video5,
			src: 'https://example.com/video14.mp4'
		},
		{
			id: 15,
			title: "열다섯 번째 비디오",
			thumbnail: video6,
			src: 'https://example.com/video15.mp4'
		},
		{
			id: 16,
			title: "열여섯 번째 비디오",
			thumbnail: video1,
			src: 'https://example.com/video16.mp4'
		},
		{
			id: 17,
			title: "열일곱 번째 비디오",
			thumbnail: video2,
			src: 'https://example.com/video17.mp4'
		},
		{
			id: 18,
			title: "열여덟 번째 비디오",
			thumbnail: video3,
			src: 'https://example.com/video18.mp4'
		},
		{
			id: 19,
			title: "열아홉 번째 비디오",
			thumbnail: video4,
			src: 'https://example.com/video19.mp4'
		},
		{
			id: 20,
			title: "스무 번째 비디오",
			thumbnail: video5,
			src: 'https://example.com/video20.mp4'
		}
	]);

	const handleLaunchApp = useCallback(async () => {
		const result = await sam({
			method: 'launch',
			parameters: { id: 'com.webos.app.self-diagnosis' }
		});
		debugLog('SAM', result);
		openPopup(false);
	}, []);

	const handlePopupOpen = useCallback(() => {
		openPopup(true);
	}, []);

	const handlePopupClose = useCallback(() => {
		openPopup(false);
	}, []);

	return {
		isPopupOpen,
		handlePopupOpen,
		handlePopupClose,
		handleLaunchApp,
		videoData,
		setVideoData
	};
};
