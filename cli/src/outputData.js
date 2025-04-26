function convertDataToArrayOfStrings(data){

    // data is row of values where the first row is the headers
    // v9 of Faker can return an object
    // then it might be an object with "data" or just a String
    // row.map(it => it["data"] ? it.data : it)
    // but we only return the data or **ERROR** from the faker generation

    var header = true;

    var addRows = [];

    data.forEach(row => {
      if (header) {
        addRows.push(row)
        header = false;
      } else {
        addRows.push(row.map(it => it["data"] ? it.data : it));
      }
    });

    return addRows;
}

export {convertDataToArrayOfStrings}