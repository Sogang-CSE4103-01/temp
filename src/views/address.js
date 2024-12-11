let userId = null; // 초기 userId 값 설정
export const ADDR_ = "http://163.239.201.166:8080"
//export const ADDR_ = "http://10.1.159.42:8080"

// userId 업데이트 함수
export const setUserId = (newUserId) => {
    userId = newUserId;
};

// userId 가져오는 함수
export const getUserId = () => {
    return userId;
};

