class VideoManager {
    constructor() {
        this.videoData = [
            {
                id: 1,
                title: "첫 번째 비디오",
                thumbnail: "path/to/thumbnail1.jpg",
                src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
                watchTime: 0 // 초기값 설정
            },
            {
                id: 2,
                title: "두 번째 비디오",
                thumbnail: "path/to/thumbnail2.jpg",
                src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
                watchTime: 0
            },
            // ... 나머지 비디오 데이터
        ];

        // 각 비디오의 watchTime을 불러오는 비동기 초기화
        this.initializeWatchTimes();
    }

    // 비디오의 시청 시간을 초기화하는 메서드
    async initializeWatchTimes() {
        for (const video of this.videoData) {
            video.watchTime = await this.loadWatchTime(video.id);
        }
    }

    // 시청 시간을 저장하는 메서드
    async saveWatchTime(videoId, time) {
        try {
            const response = await fetch('/api/watchtime', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ videoId, time }),
            });

            if (!response.ok) {
                throw new Error('Failed to save watch time');
            }

            console.log(`Watch time for video ${videoId} saved on server: ${time}`);
            this.updateWatchTime(videoId, time); // 로컬 데이터 업데이트
        } catch (error) {
            console.error('Error saving watch time:', error);
        }
    }

    // 시청 시간을 불러오는 메서드
    async loadWatchTime(videoId) {
        try {
            const response = await fetch(`/api/watchtime/${videoId}`);
            if (!response.ok) {
                throw new Error('Failed to load watch time');
            }

            const data = await response.json();
            return data.time || 0; // 반환된 시간 없으면 0
        } catch (error) {
            console.error('Error loading watch time:', error);
            return 0; // 오류 발생 시 기본값 0 반환
        }
    }

    // 로컬 데이터에서 시청 시간을 업데이트하는 메서드
    updateWatchTime(videoId, time) {
        const video = this.videoData.find(v => v.id === videoId);
        if (video) {
            video.watchTime = time;
            console.log(`Updated local watch time for video ${videoId}: ${time}`);
        }
    }

    // 비디오 데이터 반환
    getVideoData() {
        return this.videoData;
    }
}

export default VideoManager;
