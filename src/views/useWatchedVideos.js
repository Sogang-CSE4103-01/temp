import { useState, useEffect, useCallback } from 'react';
import { ADDR_ } from './address'; // 주소 관리
import defaultThumbnail from '../assets/3.jpg'; // 기본 썸네일

export const useWatchedVideos = (userId) => {
    const [watchedVideos, setWatchedVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    // 특정 유저의 시청 기록 가져오기
    const fetchWatchedVideos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${ADDR_}/api/videowatched/${userId}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                // API 응답에서 시청 기록이 있는 비디오 필터링
                const filteredVideos = data.videos.map((record) => ({
                    id: record.video.id,
                    title: record.video.title,
                    watchedTime: record.watchedTime,
                    watchedAt: record.watchedAt,
                    user: {
                        id: record.user.id,
                        username: record.user.username,
                    },
                    thumbnail: `${ADDR_}/api/thumbnail/${record.video.id}.jpg` || defaultThumbnail,
                    src: `${ADDR_}/api/video/${record.video.id}.mp4`,
                }));
                setWatchedVideos(filteredVideos);
            } else {
                console.error('Failed to fetch watched videos');
            }
        } catch (error) {
            console.error('Error fetching watched videos:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);
    useEffect(() => {
        if (userId) {
            fetchWatchedVideos();
        }
    }, [userId, fetchWatchedVideos]);

    return {
        watchedVideos,
        loading,
        fetchWatchedVideos,
    };
};
