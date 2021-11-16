const fn = require('./fn');

const userData = require('./mydata');

const FINAL_CREDIT_IDX = userData.length - 4; // 데이터 위치(졸업요건은 끝에서 4번째에 위치함)
const DOUBLE_MAJOR_IDX = userData.length - 3; // 데이터 위치(복수전공일경우, 연계전공일 경우)
const FINAL_CREDIT = userData[FINAL_CREDIT_IDX].__EMPTY_24; // 취득학점
const FINAL_SCORE = userData[DOUBLE_MAJOR_IDX].__EMPTY_29; // 평균평점
const DOUBLE_MAJOR_CREDIT = userData[DOUBLE_MAJOR_IDX].__EMPTY_16; // 복수전공
const LINK_MAJOR_CREDIT = userData[DOUBLE_MAJOR_IDX].__EMPTY_23; // 연계전공
const ESSENTIAL_MAJOR_CREDIT = userData[FINAL_CREDIT_IDX].__EMPTY_8; // 전공필수
const OPTIONAL_MAJOR_CREDIT = userData[DOUBLE_MAJOR_IDX].__EMPTY_13; // 전공선택
const MAJOR_CREDIT = ESSENTIAL_MAJOR_CREDIT + OPTIONAL_MAJOR_CREDIT; // 본전공 이수학점
const USER_STUDENT_ID = userData[0].__EMPTY_10;
const USER_ADMISSION_YEAR = parseInt(USER_STUDENT_ID.slice(0, 2));

test('복수전공을 하였다면 반환값이 복수전공이다.', () => {
  expect(fn.isOneOrTwoMajor(userData)).toBe('복수전공');
});

test('복수전공을 하지않았다면 반환값이 부전공이 아니다.', () => {
  expect(fn.isOneOrTwoMajor(userData)).not.toBe('부전공');
});

test('16학번이상일때, 이수학점이 140 이상 이라면 졸업기준을 통과한다.', () => {
  expect(fn.isSatisfiedGraduation(150, 140)).toBeTruthy();
});

test('16학번이상일때, 이수학점이 140 미만 이라면 졸업기준을 통과하지 못한다.', () => {
  expect(fn.isSatisfiedGraduation(1, 140)).toBeFalsy();
});

test('16학번미만일때, 이수학점이 130 이상 이라면 졸업기준을 통과한다.', () => {
  expect(fn.isSatisfiedGraduation(1000, 130)).toBeTruthy();
});

test('16학번미만일때, 이수학점이 130 미만 이라면 졸업기준을 통과하지 못한다.', () => {
  expect(fn.isSatisfiedGraduation(-100, 130)).toBeFalsy();
});
