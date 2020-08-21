//첫번째 엑셀체킹
function ReturnTotalCredit(event) {
  let input = event.target;
  let reader = new FileReader();

  reader.onload = function () {
    let fileData = reader.result;
    let wb = XLSX.read(fileData, { type: 'binary' });

    wb.SheetNames.forEach(function (sheetName) {
      //시트를 JSON파일로 변환
      const userData = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
      let finalCreditIndex = userData.length - 4; //데이터 위치(졸업요건은 끝에서 4번째에 위치함)
      let doubleMajorIndex = userData.length - 3; //데이터 위치(복수전공일경우, 연계전공일 경우)

      let finalCredit = userData[finalCreditIndex].__EMPTY_24; //취득학점
      let finalScore = userData[finalCreditIndex].__EMPTY_29; //평균평점
      let doubleMajorCredit = userData[doubleMajorIndex].__EMPTY_16; //복수전공
      let linkMajorCredit = userData[doubleMajorIndex].__EMPTY_23; //연계전공
      let userAdmissionYear = userID(); //입학년도

      let res1 = document.getElementById('res1');
      res1.innerHTML = CheckMajorCredit();

      let res2 = document.getElementById('res2');
      res2.innerHTML = CheckGraduationCredit();

      console.log('이름: ' + userData[0].__EMPTY_18);
      console.log('입학년도: ' + userAdmissionYear);
      console.log('이수학점: ' + finalCredit);
      console.log('최종 성적: ' + finalScore);

      CheckGraduationCredit();
      CheckMajorCredit();

      //console.log(CheckDoubleMajorOrMinor());
      console.log(userData);

      //함수s~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      //조건1. 총 졸업학점 채웠는지 확인***************************
      function CheckGraduationCredit() {
        let state;
        const before16FinalCredit = 140;
        const after16FinalCredit = 130;

        if (userAdmissionYear <= 16) {
          if (finalCredit >= before16FinalCredit) {
            //state = console.log('16년이후기준: 총 졸업학점 채웠으');
            state =
              userAdmissionYear +
              '학년 총 졸업학점: ' +
              before16FinalCredit +
              '</br>' +
              '이수 학점: ' +
              finalCredit;
          } else {
            //state = console.log('16년이후기준: 총 졸업학점 아직 못채웠으');
            state = userAdmissionYear + '학년도 총 졸업학점 불만족';
          }
        } else if (userAdmissionYear > 16) {
          if (finalCredit >= after16FinalCredit) {
            //state = console.log('17년이후기준: 총 졸업학점 채웠으');
            state = userAdmissionYear + '학년도 총 졸업학점 만족';
          } else {
            //state = console.log('17년이후기준: 총 졸업학점 아직 못채웠으');
            state = userAdmissionYear + '학년도 총 졸업학점 불만족';
          }
        }

        return state;
      }

      //복수전공인지 부전공인지 확인해주는 함수
      // function CheckDoubleMajorOrMinor2() {
      //   let state = '';
      //   for (let i = 0; i < userData.length; i++) {
      //     if (
      //       userData[i].__EMPTY_28 &&
      //       userData[i].__EMPTY_28.includes('복수전공')
      //     ) {
      //       return 'double-major';
      //     } else if (
      //       userData[i].__EMPTY_28 &&
      //       userData[i].__EMPTY_28.includes('부전공')
      //     ) {
      //       return 'minor';
      //     }
      //   }
      //   return 'mmm';
      // }
      //console.log(CheckDoubleMajorOrMinor2());

      //조건2. 전공이수학점 채웠는지 확인***************************
      function CheckMajorCredit() {
        function CheckDoubleMajorOrMinor() {
          let state = '';
          for (let i = 0; i < userData.length; i++) {
            if (
              userData[i].__EMPTY_28 &&
              userData[i].__EMPTY_28.includes('복수전공')
            ) {
              return 'double-major';
            } else if (
              userData[i].__EMPTY_28 &&
              userData[i].__EMPTY_28.includes('부전공')
            ) {
              return 'minor';
            } else {
            }
          }
        }
        console.log(CheckDoubleMajorOrMinor());

        let essentialMajorCredit = userData[finalCreditIndex].__EMPTY_8; //전공필수
        let optionalMajorCredit = userData[finalCreditIndex].__EMPTY_13; //전공선택
        let majorCredit = essentialMajorCredit + optionalMajorCredit;
        const majorCreditCriterion = 75;
        const before16_DoubleMajorMustCredit = 42;
        const after16_DoubleMajorMustCredit = 39;
        const before16_MajorOfMinorCredit = 60;
        const before16_MinorCredit = 21;
        const after16_MajorOfMinorCredit = 54;
        const after16_MinorCredit = 21;

        let doubleCredit = doubleMajorCredit + linkMajorCredit;

        let state;
        if (userAdmissionYear <= 16) {
          if (CheckDoubleMajorOrMinor === 'double-major') {
            if (doubleCredit >= before16_DoubleMajorMustCredit) {
              console.log(
                userAdmissionYear +
                  '년도 기준 복수전공 이수학점: ' +
                  before16_DoubleMajorMustCredit +
                  '본인 이수학점: ' +
                  doubleCredit +
                  '!!기준만족!!'
              );
            } else if (doubleCredit < before16_DoubleMajorMustCredit) {
              console.log(
                userAdmissionYear +
                  '년도 기준 복수전공 이수학점: ' +
                  before16_DoubleMajorMustCredit +
                  '본인 이수학점: ' +
                  doubleCredit +
                  '!!기준불만족ㅜㅠ!!'
              );
            }
          } else if (CheckDoubleMajorOrMinor === 'minor') {
            if (doubleCredit >= before16_DoubleMajorMustCredit) {
              console.log(
                userAdmissionYear +
                  '년도 기준 복수전공 이수학점: ' +
                  before16_DoubleMajorMustCredit +
                  '본인 이수학점: ' +
                  doubleCredit +
                  '!!기준만족!!'
              );
            } else if (doubleCredit < before16_DoubleMajorMustCredit) {
              console.log(
                userAdmissionYear +
                  '년도 기준 복수전공 이수학점: ' +
                  before16_DoubleMajorMustCredit +
                  '본인 이수학점: ' +
                  doubleCredit +
                  '!!기준불만족ㅜㅠ!!'
              );
            }
          } else if (CheckDoubleMajorOrMinor === 'major-only') {
          }             if (doubleCredit >= before16_DoubleMajorMustCredit) {
            console.log(
              userAdmissionYear +
                '년도 기준 복수전공 이수학점: ' +
                before16_DoubleMajorMustCredit +
                '본인 이수학점: ' +
                doubleCredit +
                '!!기준만족!!'
            );
          } else if (doubleCredit < before16_DoubleMajorMustCredit) {
            console.log(
              userAdmissionYear +
                '년도 기준 복수전공 이수학점: ' +
                before16_DoubleMajorMustCredit +
                '본인 이수학점: ' +
                doubleCredit +
                '!!기준불만족ㅜㅠ!!'
            );
          }
          } else if(userAdmissionYear > 16){
        
            if (CheckDoubleMajorOrMinor === 'double-major') {
              
            } else if (CheckDoubleMajorOrMinor === 'minor') {
            } else if (CheckDoubleMajorOrMinor === 'major-only') {
            }
          }
          }
        

        function correct() {}

        // if (majorCredit >= majorCreditCriterion) {
        //   console.log(
        //     '전공 졸업기준: ' +
        //       majorCreditCriterion +
        //       '전공 이수학점' +
        //       majorCredit
        //   );
        //   state =
        //     '전공 졸업기준: ' +
        //     majorCreditCriterion +
        //     '</br>' +
        //     '전공 이수학점' +
        //     majorCredit;
        // } else {
        //   console.log('전공학점 아직 못채웠으');
        //   state = '전공학점 조건 불만족';
        // }
        // return state;
      }

      //학번확인하기
      function userID() {
        let studentID = userData[0].__EMPTY_10;
        let studentAdmissionYear = studentID.slice(0, 2);

        return studentAdmissionYear;
      }
    });
  };
  //적어줘야지 실행됨
  reader.readAsBinaryString(input.files[0]);
}

//두번째 엑셀체킹 시작하는겨---------------------------------------------------------------
function CheckCompulsorySubject(event) {
  let input = event.target;
  let reader = new FileReader();

  reader.onload = function () {
    let fileData = reader.result;
    let workbook = XLSX.read(fileData, { bookType: 'xlsx', type: 'binary' });

    workbook.SheetNames.forEach(function (sheetName) {
      //시트를 JSON파일로 변환
      let userData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      //ㅇㅇ
      let completeSubject = [];
      let leftSubject = [];
      let subjectAreaList = [];

      for (let i = 0; i < userData.length; i++) {
        //무조건 수강해아하는 과목
        if (userData[i].선택구분 == undefined) {
          if (userData[i].취득 == ' ') {
            leftSubject[i] = userData[i].교과목명;
          } else {
            //모두수강했으
          }
        }
        //택1 들어야하는것들
        else {
          subjectAreaList[i] = userData[i].영역구분;
          for (let j = 0; j < userData.length; j++) {
            if (
              userData[i].영역구분 === userData[j].영역구분 &&
              userData[j].취득.includes('성적')
            ) {
              completeSubject[i] = userData[i].영역구분;
            } else {
              //안들은건 괜츈
            }
          }
        }
      }

      //****************************************수강하지않은 영역
      function NotTakeList() {
        let newList = subjectAreaList.filter(function (x) {
          return completeSubject.indexOf(x) < 0;
        });

        //newList = newList;

        return newList;
      }

      //****************************************겹치는거 제거
      function DeleteOverlapList(beforeSetList) {
        return Array.from(new Set(beforeSetList));
      }
      completeSubject = DeleteOverlapList(completeSubject);
      leftSubject = DeleteOverlapList(leftSubject);
      subjectAreaList = DeleteOverlapList(subjectAreaList);

      //****************************************Undefined제거하기
      function DeleteNull(subjectList) {
        return subjectList.filter(Boolean);
      }
      completeSubject = DeleteNull(completeSubject);
      leftSubject = DeleteNull(leftSubject);
      subjectAreaList = DeleteNull(subjectAreaList);

      //********************************************************************************출력****************************************
      //전체파일
      console.log(userData);
      console.log(subjectAreaList);
      console.log(completeSubject);

      //필수 안들은과목
      console.log(leftSubject);
      //안들은 영역
      console.log(NotTakeList());

      //과------------------------------------------------------------------------------------------------------------------------
      let res3 = document.getElementById('res3');
      res3.innerHTML = '수강하지않은 전공필수과목: ' + leftSubject;

      let res4 = document.getElementById('res4');
      res4.innerHTML = '수강하지않은 영역: ' + NotTakeList();
    });
  };
  //적어줘야지 실행됨
  reader.readAsBinaryString(input.files[0]);
}

let a = document.getElementById('modal');
let b = document.getElementById('body');
function OpenModal() {
  a.style.display = 'block';
}

function CloseModal() {
  a.style.display = 'none';
}
