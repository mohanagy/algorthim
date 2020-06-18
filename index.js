const moment =require('moment');
const _ =require('lodash');

// List of object segmented data 
//  filter data according to startDate - endDate

// 1- if sleep data started at 7pm and the interval was more than or equal 6 then this is counted on endDate 

// 2-  ==> if sleep data was more or equal 6 hr on the same day then he wake up for more than or equal 6 hrs then first object is counted on startData and secondObject will be counted on endDate

// 3-  ==> if sleep data was more or equal 6 hr and wake up interval was less than 6 hr then all counted as endData 

// 4- if sleep data started at 7pm and the interval was less than 6 then this is counted on startDate
// ==> if sleep data is less than 6. then next wake interval of that date was less than 6 hours then the above object will be counted on endDate
// 5- ==> if sleep data is less than 6 next wake up interval more than 6 then counted on startDate

const dates = [
  { value: "ASLEEP", sourceName: "Health", startDate: "2020-06-17T19:00:00.000", endDate: "2020-06-18T01:00:00.000", sourceId: "com.apple.Health" },
  { value: "ASLEEP", sourceName: "Health", startDate: "2020-06-18T08:00:00.000", endDate: "2020-06-18T10:00:00.000", sourceId: "com.apple.Health" }
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
const datesGroupedByDayFormatted = {...datesGroupedByDay}
const getDuration =(end,start) => moment.duration(end.diff(start)).asHours()
 for (const arrayOfData in datesGroupedByDay){
  const currentArray=datesGroupedByDay[arrayOfData];
  const nextKey=moment(arrayOfData).add(1,'d').format('YYYY-MM-DD');
  const nextArray=datesGroupedByDay[nextKey];
  // only if the object has different start and end OR object has a start date after 7pm
  currentArray.forEach((object,index) => {
    const { startDate, endDate } = object
    const startDateDay=startDate.format('DD')
    const sevenPm=moment(startDateDay+' 19:00','DD HH:mm');


  if((startDate.isAfter(sevenPm)|| startDate.isSame(sevenPm))){
    // different day ;
        const  nextDayKey=startDate.clone().add(1,'d').format('YYYY-MM-DD');
    if(!startDate.isSame(endDate,'day')){
      const hours = getDuration(endDate,startDate);
      // check next object if next object startDate - current endDate < 6  - > 6
      if(hours < 6){
        if(nextArray&&nextArray.length){
        const {startDate:nextDayStartDate}=nextArray[0];
        const wakeUpInterval = getDuration(nextDayStartDate,endDate)
      
        if(wakeUpInterval <= 6) {
        
        if(!datesGroupedByDayFormatted[nextDayKey]) datesGroupedByDayFormatted[nextDayKey]= [object]
          else {
              const isExist =datesGroupedByDayFormatted[nextDayKey].find((element)=>{
                return element.startDate.isSame(object.startDate)&&element.endDate.isSame(object.endDate)
              })
                if(!isExist) {datesGroupedByDayFormatted[nextDayKey].push(object)};
              const  previousDay=startDate.format('YYYY-MM-DD')
               datesGroupedByDayFormatted[previousDay].splice(index,1)
          
            };


        } else {
          // nothing happens
        }  
        }
      }else{
          if(!datesGroupedByDayFormatted[nextDayKey]) datesGroupedByDayFormatted[nextDayKey]= [object]
          else {
              const isExist =datesGroupedByDayFormatted[nextDayKey].find((element)=>{
                return element.startDate.isSame(object.startDate)&&element.endDate.isSame(object.endDate)
              })  
          
                if(!isExist) {datesGroupedByDayFormatted[nextDayKey].push(object)};
              const  previousDay=startDate.format('YYYY-MM-DD')
               datesGroupedByDayFormatted[previousDay].splice(index,1)
          
            };
      }
    } else {
      // same day
      const hours = getDuration(endDate,startDate);

      // check next object if next object startDate - current endDate < 6  - > 6
      if(hours < 6){
        if(nextArray&&nextArray.length){
        const {startDate:nextDayStartDate}=nextArray[0];
        const wakeUpInterval = getDuration(nextDayStartDate,endDate)
        if(wakeUpInterval <= 6) {

          // console.log(datesGroupedByDayFormatted[nextDayKey])
        if(!datesGroupedByDayFormatted[nextDayKey]) datesGroupedByDayFormatted[nextDayKey]= [object]
          else {

                                console.log(nextDayKey,datesGroupedByDayFormatted[nextDayKey])
              const isExist =datesGroupedByDayFormatted[nextDayKey].find((element)=>{
                return element.startDate.isSame(object.startDate)&&element.endDate.isSame(object.endDate)
              })

                if(!isExist) {datesGroupedByDayFormatted[nextDayKey].push(object)};
                  const  previousDay=startDate.format('YYYY-MM-DD')
                 datesGroupedByDayFormatted[previousDay].splice(index,1)
          
            };

          
        } else {
          // nothing happens
        }  
        }else{
        }
      }else{
          const  nextDayKey=endDate.format('YYYY-MM-DD')
          if(!datesGroupedByDayFormatted[nextDayKey]) datesGroupedByDayFormatted[nextDayKey]= [object]
          else {
              const isExist =datesGroupedByDayFormatted[nextDayKey].find((element)=>{
                return element.startDate.isSame(object.startDate)&&element.endDate.isSame(object.endDate)
              })
                if(!isExist) {datesGroupedByDayFormatted[nextDayKey].push(object)};
              const  previousDay=startDate.format('YYYY-MM-DD')
               datesGroupedByDayFormatted[previousDay].splice(index,1)
          
            };
      }
    }


  }else{
  }
  })


 }
console.log({
  datesGroupedByDayFormatted
})














// const arr=Object.values(datesGroupedByDay).reduce((ac,data)=>{
//   const result =data.reduce((acc,date,index)=>{
//   const {startDate,endDate}=date;
//   const hoursAndMintuesForStartDate=moment(startDate,'HH:mm');
//   const startDateDay=startDate.format('DD')
//   const sevenPm=moment(startDateDay+' 19:00','DD HH:mm')
//   const previousDay=data[index-1];
  
//   const formattedDate = moment(startDate).format('YYYY-MM-DD');
//   if(hoursAndMintuesForStartDate.isAfter(sevenPm)||hoursAndMintuesForStartDate.isSame(sevenPm)){
//     if(!acc[formattedDate])acc[formattedDate]=[date]
//     else acc[formattedDate].push(date)
//   }else if(previousDay){
//     // console.log("as")
//     const {startDate:previousDayStartDate}=previousDay;
//       const duration = moment.duration(endDate.diff(previousDayStartDate));
//     const hours = duration.asHours();
//   // console.log(hours)

//   }
//   else{
//     const nextDate=moment(formattedDate).add(1,'d').format('YYYY-MM-DD')
//     if(!acc[nextDate])acc[nextDate]=[date]
//     else acc[nextDate].push(date)
//   }
//   return acc
// },{})
//   const [key]=Object.keys(result);

//   if(!ac[key]){
//     ac[key]=result[key]
//     }
//   else ac[key]=ac[key].concat(result[key])
//   return ac
// },{})
  // console.log(arr)


  /** 
  {
    "2020-06-18":[],
    "2020-06-19":[]
  }
  */