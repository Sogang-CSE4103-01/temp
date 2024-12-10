// comments.js
import { useState, useEffect } from 'react';

export const useComments = (videoId) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const savedComments = loadComments(videoId);
        setComments(savedComments);
    }, [videoId]);

    const saveComment = (videoId, comment) => {
        const newComment = { id: Date.now(), text: comment };
        setComments(prevComments => {
            const updatedComments = [...prevComments, newComment]; 
            
            localStorage.setItem(`comments_${videoId}`, JSON.stringify(updatedComments));
            return updatedComments;
        });
    };

    const loadComments = (videoId) => {
        const savedComments = localStorage.getItem(`comments_${videoId}`);
        return savedComments ? JSON.parse(savedComments) : []; 
    };

    return {
        comments,
        saveComment,
    };
};
