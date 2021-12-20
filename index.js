const R = require("ramda")
const csv = require("csv-parser")
const fs = require("fs")

const makePredictions = seriesData => {
  // YOUR IMPLEMENTATION GOES HERE
  // PLEASE ADD ADDITIONAL FUNCTIONS AS REQUIRED
  console.log(seriesData)
}


const main = () => {
  // Note that the below code is violating the principle of immutability but is used pragmatically 
  // for interaction with the csv-parser library.  Mutating an object should generally be avoided.
  const seriesData = []
  fs.createReadStream("dates.csv")
  .pipe(csv())
  .on("data", data => seriesData.push(data))
  .on("end", () => { makePredictions(seriesData) })
}

main()
