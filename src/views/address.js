let userId = null; // 초기 userId 값 설정
export const ADDR_ = "http://192.168.72.249:8080"

// userId 업데이트 함수
export const setUserId = (newUserId) => {
    userId = newUserId;
};

// userId 가져오는 함수
export const getUserId = () => {
    return userId;
};

