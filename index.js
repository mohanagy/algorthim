const moment =require('moment');
const _ =require('lodash');


List of object segmented data 
const dates = [
  { value: "ASLEEP", sourceName: "Health", startDate: "2020-06-17T19:00:00.000", endDate: "2020-06-21T23:00:00.000+0300", sourceId: "com.apple.Health" },
  { value: "ASLEEP", sourceName: "Health", startDate: "2020-06-18T04:00:00.000", endDate: "2020-06-18T09:00:00.000", sourceId: "com.apple.Health" }
  // , { value: "ASLEEP", sourceName: "Health", startDate: "2020-06-17T09:00:00.000+0300", endDate: "2020-06-17T10:00:00.000+0300", sourceId: "com.apple.Health" }
  // , { value: "ASLEEP", sourceName: "Health", startDate: "2020-06-17T06:00:00.000+0300", endDate: "2020-06-17T07:00:00.000+0300", sourceId: "com.apple.Health" }
]

  const groupHealthKitDataByDays = data =>  data.reduce((acc, date) => {
    const { startDate,endDate } = date;
    const formattedDate = moment(startDate).format('YYYY-MM-DD');
    if (!acc[formattedDate]) acc[formattedDate] = [{...date,startDate:moment(startDate),endDate:moment(endDate)}];
    else acc[formattedDate].push({...date,startDate:moment(startDate),endDate:moment(endDate)});
    return acc;
  }, {});




const datesGroupedByDay=groupHealthKitDataByDays(dates)

const arr=Object.values(datesGroupedByDay).reduce((ac,data)=>{
  const result =data.reduce((acc,date,index)=>{
  const {startDate,endDate}=date;
  const hoursAndMintuesForStartDate=moment(startDate,'HH:mm');
  const startDateDay=startDate.format('DD')
  const sevenPm=moment(startDateDay+' 19:00','DD HH:mm')
  const previousDay=data[index-1];
  console.log({
    previousDay,
    index
  })
  const formattedDate = moment(startDate).format('YYYY-MM-DD');
  if(hoursAndMintuesForStartDate.isAfter(sevenPm)||hoursAndMintuesForStartDate.isSame(sevenPm)){
    if(!acc[formattedDate])acc[formattedDate]=[date]
    else acc[formattedDate].push(date)
  }else if(previousDay){
    console.log("as")
    const {startDate:previousDayStartDate}=previousDay;
      const duration = moment.duration(endDate.diff(previousDayStartDate));
      const hours = duration.asHours();
  console.log(hours)

  }
  else{
    const nextDate=moment(formattedDate).add(1,'d').format('YYYY-MM-DD')
    if(!acc[nextDate])acc[nextDate]=[date]
    else acc[nextDate].push(date)
  }
  return acc
},{})
  const [key]=Object.keys(result);

  if(!ac[key]){
    ac[key]=result[key]
    }
  else ac[key]=ac[key].concat(result[key])
  return ac
},{})
  console.log(arr)