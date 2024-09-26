const date = new Date(); 
const options : Intl.DateTimeFormatOptions  = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true, 
    timeZone: 'Asia/Kolkata' 
};


const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

export default formattedDate