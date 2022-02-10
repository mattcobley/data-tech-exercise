# Date Prediction Coding Exercise

## Overview

Please find provided a CSV file containing observed dates for monthly direct debits and standing orders.

Each series of dates has its own series identifier and the date each transaction in the series was observed.

Your task is to predict the next date of the series taking into account the following:

- The simplest solution is preferred, even if it is not the most accurate. Although these two criteria, simplicity and accuracy, need to be balanced.
- No assessment of accuracy needs to be provided, a reasoned argument can be presented when answering the questions below.
- We program in a functional style and the use of RamdaJS is encouraged as we use the library extensively <https://ramdajs.com/docs/>. Some RamdaJS methods we commonly use are compose, groupBy, map, reduce, aperture and mapAccum amongst others. Sometimes we use a mix of functional and imperative style so do not feel the need to make everything functional, especially if it is at the expense of readability. However, consider immutability a key principle that should be upheld where possible, i.e. avoid reassigning identifiers or mutating objects.
- Results should be produced in CSV or JSON format.
- The exercise should take no more than an hour and reflects the day to day work conducted by the Data Team so hopefully should be fun.

## Questions

- Describe the method you used to predict the next date and why you chose it?

  In an effort to balance simplicity and accuracy, I decided to ignore the distribution of results within a series, and simply find the average time between entries within a series and use that to then predict when the next one would be by adding that on to the most recent date, as it would be far more complex and time-consuming (for this exercise) to consider whether more or fewer payments occurred in the past or closer to the most recent entry and look at the gap between payments as a function of time and use the resultant formula to calculate when future payments are likely to occur.

  In terms of getting the average time between entries, I did consider sorting the dates, then going through and recording the time between each pair and getting an average of that, but thought it would likely be slightly more complex to implement than finding the min, max and then dividing by the total number of entries. I discounted the current date for this exercise, as the dates in the series appear to be from 2019/2020 and so considering the current date would skew the results and I assumed that the emphasis would be on the next entry in each series rather than relating it specifically to a real-world situation where the current date would be taken into account - we wouldn't predict that the next payment would be in the past, in reality, of course.

  I also added a small modifier to tweak the date if it lands on a weekend, since most banks don't permit these sorts of transactions to take place then, so that it instead lands on the nearest weekday, forwards or backwards.

  The simplest solution would be to simply look at the most recent gap between transactions, and assume that the next one is of the same duration, but I considered this to be too simplistic and would obviously be susceptible to large deviations from the average for that series.

- What strategy would you use to implement a more accurate date prediction mechanism and what estimate would you give in terms of implementation effort required?

  One possible approach would be to perform some sort of logistical regression against each series, marking each day as "paid" or "not paid", and then use the model to extrapolate out the data and work out when the next one is likely to be due, although this would need additional data to be generated for the non-payment days, and so there would be some upfront generation of this data, potentially.

  I'm mainly a developer, rather than data scientist, but this is a common problem and so I would hope that it wouldn't take too long. I'd maybe break it down into:
  - Generate data for missing days
  - Generate logistic regression model
  - Test model against data

  I think I would be able to follow existing approaches and complete it in a day or two.

  As discussed in the first question, we could look at the gap between payments as a function of time and use the calculated formula to then predict future payments.

  Other considerations to make the existing approach slightly improved would be to consider whether the payment comes out on the same day each month - e.g. 28th - and if so, simply follow that pattern.

  We could also look at just a subset of the more recent entries in the series (biasing our predictions towards more recent transactions, assuming that any future transactions are more likely to follow the recent behaviour).

  It might be that the payments take place in relation to other activity in the account, and so with additional data around this we could see if, for example, these payments occur the day after money is debitted in from another account.

  Also, another simple check would be to see if the payments occur on the same weekday each month, e.g. the third Monday, and if so it would be straightforward to then predict when the next one is due.

- How would you test the accuracy of date prediction?

  If it was a problem where the model could be applied across series, you could hold some series back as test data, remove the last (date-wise) entry from the series and then see how accurately the model predicts the result for each series. You could do something similar within each series by removing the most recent date before generating the prediction and seeing how close the prediction is to the real "most-recent" date.

  Another option would be to plot out the data for each series minus the last value and see if the next date seems to fit within what appears to be a suitable timeframe, based on how the graph ebs and flows.
