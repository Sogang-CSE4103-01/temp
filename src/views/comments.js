// comments.js
import { useState, useEffect } from 'react';

// 댓글 데이터를 관리하기 위한 커스텀 훅
export const useComments = (videoId) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        // 비디오에 대한 저장된 댓글 불러오기
        const savedComments = loadComments(videoId);
        setComments(savedComments);
    }, [videoId]);

    // 댓글을 저장하는 함수
    const saveComment = (videoId, comment) => {
        const newComment = { id: Date.now(), text: comment }; // 새로운 댓글 객체 생성
        setComments(prevComments => {
            const updatedComments = [...prevComments, newComment]; // 댓글 업데이트
            // 로컬 스토리지에 저장
            localStorage.setItem(`comments_${videoId}`, JSON.stringify(updatedComments));
            return updatedComments;
        });
    };

    // 댓글을 불러오는 함수
    const loadComments = (videoId) => {
        const savedComments = localStorage.getItem(`comments_${videoId}`);
        return savedComments ? JSON.parse(savedComments) : []; // 저장된 댓글이 있으면 파싱하여 반환
    };

    return {
        comments,
        saveComment,
    };
};
