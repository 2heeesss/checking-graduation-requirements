//첫번째 엑셀확인해주기
function ReturnTotalCredit(event) {
  let input = event.target;
  let reader = new FileReader();

  reader.onload = function () {
    let fileData = reader.result;
    let wb = XLSX.read(fileData, { type: 'binary' });

    wb.SheetNames.forEach(function (sheetName) {
      //시트네임 출력하기
      //console.log('시트이름: ' + sheetName);
      //시트를 JSON파일로 변환
      let userData = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
      let finalCreditIndex = userData.length - 4; //데이터 위치(졸업요건은 끝에서 4번째에 위치함)
      let doubleMajorIndex = userData.length - 3; //데이터 위치(복수전공일경우)

      //함수 하나 만드는게 좋을것같음
      let finalCredit = userData[finalCreditIndex].__EMPTY_24; //취득학점
      let finalScore = userData[finalCreditIndex].__EMPTY_29; //평균평점
      let doubleMajorCredit = userData[doubleMajorIndex].__EMPTY_16; //복수전공

      let userAdmissionYear = how(); //입학년도

      //**지울거 */
      console.log('이름:          ' + userData[0].__EMPTY_18);
      console.log('복수?전공?: ' + userData[doubleMajorIndex].__EMPTY_16);

      if (doubleMajorCredit == undefined) {
        console.log('복수전공 듣고있넹..');
      } else {
        console.log('복수전공 듣는사람 아니구나 ㅋ.ㅋ');
      }

      console.log('이수학점: ' + finalCredit);
      console.log('최종 성적: ' + finalScore);
      console.log('입학년도: ' + userAdmissionYear);
      CheckGraduationCredit();
      CheckMajorCredit();

      //전체파일
      console.log(userData);

      function kk() {}

      //조건1. 총 졸업학점 채웠는지 확인***************************
      function CheckGraduationCredit() {
        let state;
        if (userAdmissionYear <= 16) {
          if (finalCredit >= 140) {
            state = console.log('16년이후기준: 총 졸업학점 채웠으');
          } else {
            state = console.log('16년이후기준: 총 졸업학점 아직 못채웠으');
          }
        } else if (userAdmissionYear > 16) {
          if (finalCredit >= 130) {
            state = console.log('17년이후기준: 총 졸업학점 채웠으');
          } else {
            state = console.log('17년이후기준: 총 졸업학점 아직 못채웠으');
          }
        }

        return state;
      }
      //조건2. 전공이수학점 채웠는지 확인***************************
      function CheckMajorCredit() {
        let essentialMajorCredit = userData[finalCreditIndex].__EMPTY_8; //전공필수
        let optionalMajorCredit = userData[finalCreditIndex].__EMPTY_13; //전공선택
        let majorCredit = essentialMajorCredit + optionalMajorCredit;
        let state;

        if (majorCredit >= 75) {
          state = console.log('전공학점 채웠으');
        } else {
          state = console.log('전공학점 아직 못채웠으');
        }
        return state;
      }

      //학번확인하기***************************
      function how() {
        let studentID = userData[0].__EMPTY_10;
        studentAdmissionYear = studentID.slice(0, 2);

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
    let wb = XLSX.read(fileData, { type: 'binary' });

    wb.SheetNames.forEach(function (sheetName) {
      //시트네임 출력하기
      console.log('시트이름: ' + sheetName);
      //시트를 JSON파일로 변환
      let userData = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);

      for (let i = 0; i < userData.length; i++) {
        console.log(userData[i].영역구분);

        //1역역만 나오는거 확인완료
        if (userData[i].영역구분 === '제1영역') {
          //console.log('1영역 ㄱ ㄱ ㄱ ㄱ ㄱ');
          if (userData[i].취득 === ' ' && userData[i + 1].취득 === ' ') {
            console.log('둘다 비어있대..');
          } else {
            console.log('둘중에 하나는 들었겠징');
          }
        }
      }

      //내가쓸거 3차에
      if (userData[2].영역구분 === userData[3].영역구분) {
        //파일1을써도 같아요가나옴 왜냐? 둘다 undefined값이니까 ㅋㅋㅋ
        console.log('같아요');
      } else {
        console.log('틀력요');
      }
      if (userData[3].영역구분 === userData[4].영역구분) {
        console.log('22같아요');
      } else {
        console.log('22틀력요');
      }
      //전체파일
      console.log(userData);
    });
  };
  //적어줘야지 실행됨
  reader.readAsBinaryString(input.files[0]);
}
