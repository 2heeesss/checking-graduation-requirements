function ReturnTotalCredit(event) {
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
      let finalCreditIndex = userData.length - 4; //이 자리에 최종학점이있어요

      let finalCredit = userData[finalCreditIndex].__EMPTY_24;
      console.log(finalCredit);
    });
  };
  //적어줘야지 실행됨
  reader.readAsBinaryString(input.files[0]);
}
