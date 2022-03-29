const R = require("ramda")
const csv = require("csv-parser")
const fs = require("fs")
const min = require("ramda/src/min")
const max = require("ramda/src/max")

const getTimestampFromSeriesEntry = dateEntry => {
  return Date.parse(dateEntry.date)
}

const getTimestampsForSeries = R.map(getTimestampFromSeriesEntry)

// Using reduce is prefered over just using Math.max or Math.min on the array for large arrays: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
const getMaxTimeFromTimestamps = R.reduce(max, 0)

// Could alternatively get the min time alongside the max time by getting the smallest value on each iteration of the max reducer and pushing that to a variable so that you only need to iterate through once, but have kept it simple for readability.
const getMinTimeFromTimestamps = (timestamps) => R.reduce(min, timestamps[0], timestamps)

const getMaxAndMinTimeFromTimestamps = (timestamps) => {
  const maxTime = getMaxTimeFromTimestamps(timestamps)
  const minTime = getMinTimeFromTimestamps(timestamps)
  return {
    maxTime,
    minTime
  }
}

const movePredictionToWeekday = (timestamp) => {
  const date = new Date(timestamp)
  // Sunday - Saturday : 0 - 6
  const sunday = 0
  const saturday = 6
  const dayOfWeek = date.getDay()

  if (dayOfWeek === sunday) {
    const monday = date.getDate() + 1
    date.setDate(monday)
  }

  if (dayOfWeek === saturday) {
    const friday = date.getDate() - 1
    date.setDate(friday)
  }

  return date
}

// Assumed that you wanted the results in the same format we started with
const getDateStringFromDate = entryDate => {
  return entryDate.toISOString().split('T')[0]
}

const getNextDateForSingleSeries = (dataForSingleSeries) => {
  const timestamps = getTimestampsForSeries(dataForSingleSeries)

  const { maxTime, minTime } = getMaxAndMinTimeFromTimestamps(timestamps)

  const numberOfEntriesInSeries = dataForSingleSeries.length
  const numberOfGapsBetweenEntries = numberOfEntriesInSeries - 1

  const averageTimeBetweenEntries = (maxTime - minTime) / numberOfGapsBetweenEntries
  const nextDateEntryTimestamp = maxTime + averageTimeBetweenEntries

  const nextDateNotWeekend = movePredictionToWeekday(nextDateEntryTimestamp)
  const nextDateString = getDateStringFromDate(nextDateNotWeekend)

  return {
    seriesid: dataForSingleSeries[0].seriesid,
    date: nextDateString
  }
}

const getNextDateForAllSeries = R.map(getNextDateForSingleSeries)

const seriesIdMatch = (input1, input2) => {
  return input1.seriesid === input2.seriesid
}

const groupBySeriesId = R.groupWith(seriesIdMatch)

const makePredictions = seriesData => {
  const getPredictions = R.compose(
    getNextDateForAllSeries,
    groupBySeriesId
  )
  const results = getPredictions(seriesData)
  const writeStream = fs.createWriteStream("results.json")
  writeStream.write(JSON.stringify(results))
  return results
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
