//첫번째 엑셀체킹
function ReturnTotalCredit(event) {
  let input = event.target;
  let reader = new FileReader();

  reader.onload = function () {
    let fileData = reader.result;
    let wb = XLSX.read(fileData, { type: 'binary' });
    const userData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    const FINAL_CREDIT_IDX = userData.length - 4; //데이터 위치(졸업요건은 끝에서 4번째에 위치함)
    const DOUBLE_MAJOR_IDX = userData.length - 3; //데이터 위치(복수전공일경우, 연계전공일 경우)

    const FINAL_CREDIT = userData[FINAL_CREDIT_IDX].__EMPTY_24; //취득학점
    const FINAL_SCORE = userData[DOUBLE_MAJOR_IDX].__EMPTY_29; //평균평점
    const DOUBLE_MAJOR_CREDIT = userData[DOUBLE_MAJOR_IDX].__EMPTY_16; //복수전공
    const LINK_MAJOR_CREDIT = userData[DOUBLE_MAJOR_IDX].__EMPTY_23; //연계전공

    const ESSENTIAL_MAJOR_CREDIT = userData[FINAL_CREDIT_IDX].__EMPTY_8; //전공필수
    const OPTIONAL_MAJOR_CREDIT = userData[DOUBLE_MAJOR_IDX].__EMPTY_13; //전공선택
    const MAJOR_CREDIT = ESSENTIAL_MAJOR_CREDIT + OPTIONAL_MAJOR_CREDIT; //본전공 이수학점

    wb.SheetNames.forEach(function (sheetName) {
      let userAdmissionYear = userID(); //입학년도

      let res1 = document.getElementById('res1');
      res1.innerHTML = CheckMajorCredit();

      let res2 = document.getElementById('res2');
      res2.innerHTML = CheckGraduationCredit();

      console.log('이름: ' + userData[0].__EMPTY_18);
      console.log('입학년도: ' + userAdmissionYear);
      console.log('이수학점: ' + FINAL_CREDIT);
      console.log('최종 성적: ' + FINAL_SCORE);

      CheckGraduationCredit();

      console.log(userData);
      console.log(CheckDoubleMajorOrMinor());
      console.log(CheckOnlyMajor());
      console.log(CheckMajorCredit());
      console.log(CheckDoubleMajorCredit());

      //함수s~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //함수s~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //함수s~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //함수s~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //함수s~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      //복전 or 부전 확인
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
      //부전 or 복전 or 본전 확인
      function CheckOnlyMajor() {
        if (CheckDoubleMajorOrMinor() === undefined) {
          return 'major';
        } else {
          return CheckDoubleMajorOrMinor();
        }
      }

      //학점 undefined 인거 0으로 바꿔주기
      function CheckCreditZero(userMajorCredit) {
        if (userMajorCredit === undefined) {
          return (userMajorCredit = 0);
        } else {
          return parseInt(userMajorCredit);
        }
      }

      //학번확인하기
      function userID() {
        let studentID = userData[0].__EMPTY_10;
        let studentAdmissionYear = parseInt(studentID.slice(0, 2));

        return studentAdmissionYear;
      }

      //조건1. 총 졸업학점 채웠는지 확인***************************
      function CheckGraduationCredit() {
        let state;
        const before16FinalCredit = 140;
        const after16FinalCredit = 130;

        if (userAdmissionYear <= 16) {
          if (FINAL_CREDIT >= before16FinalCredit) {
            //state = console.log('16년이후기준: 총 졸업학점 채웠으');
            state =
              userAdmissionYear +
              '학년 총 졸업학점: ' +
              before16FinalCredit +
              '</br>' +
              '이수 학점: ' +
              FINAL_CREDIT;
          } else {
            //state = console.log('16년이후기준: 총 졸업학점 아직 못채웠으');
            state = userAdmissionYear + '학년도 총 졸업학점 불만족';
          }
        } else if (userAdmissionYear > 16) {
          if (FINAL_CREDIT >= after16FinalCredit) {
            //state = console.log('17년이후기준: 총 졸업학점 채웠으');
            state = userAdmissionYear + '학년도 총 졸업학점 만족';
          } else {
            //state = console.log('17년이후기준: 총 졸업학점 아직 못채웠으');
            state = userAdmissionYear + '학년도 총 졸업학점 불만족';
          }
        }

        return state;
      }
      //복전 본전공 확인
      function CheckMajorCredit() {
        const before16_MajorMustCredit = 42;
        const after16_MajorMustCredit = 39;
        const before16_OnlyMajorMustCredit = 75;
        const after16_OnlyMajorMustCredit = 70;
        const before16_MajorOfMinorCredit = 60;
        const after16_MajorOfMinorCredit = 54;

        if (userAdmissionYear <= 16) {
          if (CheckOnlyMajor() === 'double-major') {
            if (MAJOR_CREDIT >= before16_MajorMustCredit) {
              return '복전 본 o';
            } else if (MAJOR_CREDIT < before16_MajorMustCredit) {
              return '복전 본 x';
            } else {
              return '이상해씨';
            }
          } else if (CheckOnlyMajor() === 'minor') {
            if (MAJOR_CREDIT >= before16_MajorOfMinorCredit) {
              return '부전공 본 o';
            } else if (MAJOR_CREDIT < before16_MajorOfMinorCredit) {
              return '부전공 본 x';
            } else {
              return '이상해씨2';
            }
          } else if (CheckOnlyMajor() === 'major') {
            if (MAJOR_CREDIT >= before16_OnlyMajorMustCredit) {
              return '전공하나ㅇ';
            } else if (MAJOR_CREDIT < before16_OnlyMajorMustCredit) {
              return '전공하나 x';
            } else {
              return '이상해씨3';
            }
          }
        } else if (userAdmissionYear > 16) {
          if (CheckOnlyMajor() === 'double-major') {
            if (MAJOR_CREDIT >= after16_MajorMustCredit) {
              return '17복전 본 o';
            } else if (MAJOR_CREDIT < after16_MajorMustCredit) {
              return '복전 본 x';
            } else {
              return '이상해씨';
            }
          } else if (CheckOnlyMajor() === 'minor') {
            if (MAJOR_CREDIT >= after16_MajorOfMinorCredit) {
              return '17부전공 본 o';
            } else if (MAJOR_CREDIT < after16_MajorOfMinorCredit) {
              return '17부전공 본 x';
            } else {
              return '이상해씨2';
            }
          } else if (CheckOnlyMajor() === 'major') {
            if (MAJOR_CREDIT >= after16_OnlyMajorMustCredit) {
              return '17전공하나ㅇ';
            } else if (MAJOR_CREDIT < after16_OnlyMajorMustCredit) {
              return '17전공하나 x';
            } else {
              return '이상해씨3';
            }
          }
        }
      }

      //조건2. 전공이수학점 채웠는지 확인***************************
      function CheckDoubleMajorCredit() {
        const before16_DoubleMajorMustCredit = 42;
        const after16_DoubleMajorMustCredit = 39;

        const MinorCredit = 21;

        DOUBLE_MAJOR_CREDIT = CheckCreditZero(DOUBLE_MAJOR_CREDIT);
        LINK_MAJOR_CREDIT = CheckCreditZero(LINK_MAJOR_CREDIT);

        let doubleCredit = LINK_MAJOR_CREDIT + DOUBLE_MAJOR_CREDIT;

        console.log(doubleCredit);

        let state = '';
        if (userAdmissionYear <= 16) {
          if (CheckOnlyMajor() === 'double-major') {
            if (doubleCredit >= before16_DoubleMajorMustCredit) {
              return '복전 o';
            } else if (doubleCredit < before16_DoubleMajorMustCredit) {
              return '복전 x';
            } else {
              return '이상해씨';
            }
          } else if (CheckOnlyMajor() === 'minor') {
            if (doubleCredit >= MinorCredit) {
              return '부전공 o';
            } else if (doubleCredit < MinorCredit) {
              return '부전공 x';
            } else {
              return '이상해씨2';
            }
          }
        } else if (userAdmissionYear > 16) {
          if (CheckOnlyMajor() === 'double-major') {
            if (doubleCredit >= after16_DoubleMajorMustCredit) {
              return '17복전 o';
            } else if (doubleCredit < after16_DoubleMajorMustCredit) {
              return '17복전 x';
            } else {
              return '이상해씨';
            }
          } else if (CheckOnlyMajor() === 'minor') {
            if (doubleCredit >= MinorCredit) {
              return '17부전 o';
            } else if (doubleCredit < MinorCredit) {
              return '17부전 x';
            } else {
              return '이상해애애씨';
            }
          }
        }
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
      let completeSubject = [];
      let leftSubject = [];
      let subjectAreaList = [];

      //필수과목
      function MustSubjectList() {
        for (let i = 0; i < userData.length; i++) {
          if (userData[i].선택구분 === undefined) {
            if (userData[i].취득 === ' ') {
              leftSubject[i] = userData[i].교과목명;
            } else {
              //모두수강했으
            }
          }
        }
      }

      //선택영역
      function ChoiceSubjectList() {
        for (let i = 0; i < userData.length; i++) {
          if (userData[i].선택구분 !== undefined) {
            subjectAreaList[i] = userData[i].영역구분;
            for (let j = 0; j < userData.length; j++) {
              if (
                userData[i].영역구분 === userData[j].영역구분 &&
                userData[j].취득 &&
                userData[j].취득.includes('성적')
              ) {
                completeSubject[i] = userData[i].영역구분;
              } else {
                //안들은건 괜츈
              }
            }
          }
        }
      }

      MustSubjectList();
      ChoiceSubjectList();

      // for (let i = 0; i < userData.length; i++) {
      //   //무조건 수강해아하는 과목
      //   if (userData[i].선택구분 == undefined) {
      //     if (userData[i].취득 == ' ') {
      //       leftSubject[i] = userData[i].교과목명;
      //     } else {
      //       //모두수강했으
      //     }
      //   }
      //   //택1 들어야하는것들
      //   else {
      //     subjectAreaList[i] = userData[i].영역구분;
      //     for (let j = 0; j < userData.length; j++) {
      //       if (
      //         userData[i].영역구분 === userData[j].영역구분 &&
      //         userData[j].취득.includes('성적')
      //       ) {
      //         completeSubject[i] = userData[i].영역구분;
      //       } else {
      //         //안들은건 괜츈
      //       }
      //     }
      //   }
      // }

      // 겹치는거 제거
      function DeleteOverlapList(beforeSetList) {
        return Array.from(new Set(beforeSetList));
      }
      completeSubject = DeleteOverlapList(completeSubject);
      leftSubject = DeleteOverlapList(leftSubject);
      subjectAreaList = DeleteOverlapList(subjectAreaList);

      // Undefined제거하기
      function DeleteNull(subjectList) {
        return subjectList.filter(Boolean);
      }
      completeSubject = DeleteNull(completeSubject);
      leftSubject = DeleteNull(leftSubject);
      subjectAreaList = DeleteNull(subjectAreaList);

      // 수강하지않은 영역
      function NotTakeList() {
        let newList = subjectAreaList.filter(function (x) {
          return completeSubject.indexOf(x) < 0;
        });
        return newList;
      }

      // 2차원 배열 생성
      function create2DArray(rows, columns) {
        let arr = new Array(rows);
        for (var i = 0; i < rows; i++) {
          arr[i] = new Array(columns);
        }
        return arr;
      }

      function FindOldStudent() {
        for (let i = 0; i < userData.length; i++) {
          if (userData[i].영역구분 === '제5영역') {
            return 'old';
          }
        }
        return 'young';
      }
      console.log(FindOldStudent());

      let notTakelist = create2DArray(NotTakeList().length, userData.length);
      let countList = [];
      let count = 0;
      function NotTakeSubjectList() {
        for (let i = 0; i < NotTakeList().length; i++) {
          for (let j = 0; j < userData.length; j++) {
            if (NotTakeList()[i] === userData[j].영역구분) {
              notTakelist[i][j] = userData[j].교과목명;
              if (notTakelist[i][j].length) {
                count++;
                countList[i] = count;
              }
            }
          }
          count = 0;
        }
      }
      NotTakeSubjectList();

      function ListSort() {
        for (let i = 0; i < NotTakeList().length; i++) {
          notTakelist[i].sort((a, b) => b.length - a.length);
        }
      }
      ListSort();

      function ListSplice() {
        for (let i = 0; i < NotTakeList().length; i++) {
          notTakelist[i].splice(countList[i], userData.length);
        }
      }
      ListSplice();

      function ListJoinOR() {
        let okok = [];
        for (let i = 0; i < NotTakeList().length; i++) {
          okok[i] = notTakelist[i].join(' or ');
        }

        return okok;
      }
      ListJoinOR();

      console.log(notTakelist);
      console.log(ListJoinOR());
      console.log(typeof ListJoinOR());
      let k = ListJoinOR();

      function EnterList(List) {
        let newList = '';
        for (let i = 0; i < List.length; i++) {
          newList += List[i] + '</br>';
        }
        return newList;
      }
      let u = EnterList(ListJoinOR());

      //오브젝트를 문자열로
      //var result = test.replace('가', '나');

      // k = JSON.stringify(k);
      // console.log(k, typeof k);
      // let kk = k.replace(/,/gi, '\n');
      // console.log(kk);

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
      res4.innerHTML = '수강하지않은 영역: ' + u;
    });
  };
  //적어줘야지 실행됨
  reader.readAsBinaryString(input.files[0]);
}

let a = document.getElementById('modal');

function OpenModal() {
  a.style.display = 'block';
}

function CloseModal() {
  a.style.display = 'none';
}

function Check(event) {
  let input = event.target;
  let reader = new FileReader();

  reader.onload = function () {
    let fileData = reader.result;
    let workbook = XLSX.read(fileData, { bookType: 'xlsx', type: 'binary' });

    workbook.SheetNames.forEach(function (sheetName) {
      //시트를 JSON파일로 변환
      let userData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      let completeSubject = [];
      let leftSubject = [];
      let subjectAreaList = [];

      //필수과목
      function MustSubjectList() {
        for (let i = 0; i < userData.length; i++) {
          if (userData[i].선택구분 === undefined) {
            if (userData[i].취득 === ' ') {
              leftSubject[i] = userData[i].교과목명;
            } else {
              //모두수강했으
            }
          }
        }
      }

      //선택영역
      function ChoiceSubjectList() {
        for (let i = 0; i < userData.length; i++) {
          if (userData[i].선택구분 !== undefined) {
            subjectAreaList[i] = userData[i].영역구분;
            for (let j = 0; j < userData.length; j++) {
              if (
                userData[i].영역구분 === userData[j].영역구분 &&
                userData[j].취득 &&
                userData[j].취득.includes('성적')
              ) {
                completeSubject[i] = userData[i].영역구분;
              } else {
                //안들은건 괜츈
              }
            }
          }
        }
      }

      MustSubjectList();
      ChoiceSubjectList();

      // for (let i = 0; i < userData.length; i++) {
      //   //무조건 수강해아하는 과목
      //   if (userData[i].선택구분 == undefined) {
      //     if (userData[i].취득 == ' ') {
      //       leftSubject[i] = userData[i].교과목명;
      //     } else {
      //       //모두수강했으
      //     }
      //   }
      //   //택1 들어야하는것들
      //   else {
      //     subjectAreaList[i] = userData[i].영역구분;
      //     for (let j = 0; j < userData.length; j++) {
      //       if (
      //         userData[i].영역구분 === userData[j].영역구분 &&
      //         userData[j].취득.includes('성적')
      //       ) {
      //         completeSubject[i] = userData[i].영역구분;
      //       } else {
      //         //안들은건 괜츈
      //       }
      //     }
      //   }
      // }

      // 겹치는거 제거
      function DeleteOverlapList(beforeSetList) {
        return Array.from(new Set(beforeSetList));
      }
      completeSubject = DeleteOverlapList(completeSubject);
      leftSubject = DeleteOverlapList(leftSubject);
      subjectAreaList = DeleteOverlapList(subjectAreaList);

      // Undefined제거하기
      function DeleteNull(subjectList) {
        return subjectList.filter(Boolean);
      }
      completeSubject = DeleteNull(completeSubject);
      leftSubject = DeleteNull(leftSubject);
      subjectAreaList = DeleteNull(subjectAreaList);

      // 수강하지않은 영역
      function NotTakeList() {
        let newList = subjectAreaList.filter(function (x) {
          return completeSubject.indexOf(x) < 0;
        });
        return newList;
      }

      // 2차원 배열 생성
      function create2DArray(rows, columns) {
        let arr = new Array(rows);
        for (var i = 0; i < rows; i++) {
          arr[i] = new Array(columns);
        }
        return arr;
      }

      function FindOldStudent() {
        for (let i = 0; i < userData.length; i++) {
          if (userData[i].영역구분 === '제5영역') {
            return 'old';
          }
        }
        return 'young';
      }
      console.log(FindOldStudent());

      let notTakelist = create2DArray(NotTakeList().length, userData.length);
      let countList = [];
      let count = 0;
      function NotTakeSubjectList() {
        for (let i = 0; i < NotTakeList().length; i++) {
          for (let j = 0; j < userData.length; j++) {
            if (NotTakeList()[i] === userData[j].영역구분) {
              notTakelist[i][j] = userData[j].교과목명;
              if (notTakelist[i][j].length) {
                count++;
                countList[i] = count;
              }
            }
          }
          count = 0;
        }
      }
      NotTakeSubjectList();

      function ListSort() {
        for (let i = 0; i < NotTakeList().length; i++) {
          notTakelist[i].sort((a, b) => b.length - a.length);
        }
      }
      ListSort();

      function ListSplice() {
        for (let i = 0; i < NotTakeList().length; i++) {
          notTakelist[i].splice(countList[i], userData.length);
        }
      }
      ListSplice();

      function ListJoinOR() {
        let okok = [];
        for (let i = 0; i < NotTakeList().length; i++) {
          okok[i] = notTakelist[i].join(' or ');
        }

        return okok;
      }
      ListJoinOR();

      console.log(notTakelist);
      console.log(ListJoinOR());
      console.log(typeof ListJoinOR());
      let k = ListJoinOR();

      function EnterList(List) {
        let newList = '';
        for (let i = 0; i < List.length; i++) {
          newList += List[i] + '</br>';
        }
        return newList;
      }
      let u = EnterList(ListJoinOR());

      //오브젝트를 문자열로
      //var result = test.replace('가', '나');

      // k = JSON.stringify(k);
      // console.log(k, typeof k);
      // let kk = k.replace(/,/gi, '\n');
      // console.log(kk);

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
      res4.innerHTML = '수강하지않은 영역: ' + u;
    });
  };
  //적어줘야지 실행됨
  reader.readAsBinaryString(input.files[0]);
}
