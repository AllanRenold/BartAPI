var oriLat, oriLng, destLat, destLng;

var visit;

//The refreshAll() function executes everytime a page loads and implements local storage by keeping record of everytime a user has visited the page. It also displays the fuctions which dynamically generate the drop down menu for station names.
function refreshAll(){
    if(typeof(Storage) !== "undefined") {
    visit = localStorage.getItem("visited");
    if(visit===null){ //check if the user is visiting for the first time.
        visit=0; 
        alert("Welcome New Visitor");
        visit++;
        localStorage.setItem("visited",visit); //make an entry that the user has visited
    }
        else{
            visit++; //increment the visit variable which tells the user how many times he has visited the site.
            localStorage.setItem("visited",visit);
            alert("Welcome Back Visitor. This is your visit #"+visit);
        }
} 
    origStation(); //Gives the list of origin stations
    destStation(); //Gives the list of destination stations
}

//This function will dynamically generate a list of origin stations
function origStation(){
var xmlhttp, xmlDoc;
xmlhttp = new XMLHttpRequest(); 
xmlhttp.open("GET", "http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V", false); //AJAX request to obtain XML of stations list
xmlhttp.send();
xmlDoc = xmlhttp.responseXML;
    
    var len = xmlDoc.childNodes[0].childNodes[1].childNodes.length; //obtain the length of the array containing names of stations
    var newDiv = document.createElement('div'); 
    var select = '<select id="origName">';
    
    for (var i=0; i<len; i++){
        var origName = xmlDoc.childNodes[0].childNodes[1].childNodes[i].childNodes[0].childNodes[0].nodeValue; //Station name
        var abbr = xmlDoc.childNodes[0].childNodes[1].childNodes[i].childNodes[1].childNodes[0].nodeValue; // Station abbreviation
        var lat = xmlDoc.childNodes[0].childNodes[1].childNodes[i].childNodes[2].childNodes[0].nodeValue; //Station Latitiude
        var lng = xmlDoc.childNodes[0].childNodes[1].childNodes[i].childNodes[3].childNodes[0].nodeValue; //Station Longitude
        select +='<option value='+abbr+' lat='+lat+' lng='+lng+'>'+origName+'</option>'; // <option value=abbreviaton lat=latitude long=longitude> StationName </option>
    }
    select += "</select>";
    newDiv.innerHTML = select;
    var k = document.getElementById("origin");
    if(k!=null)
    {k.appendChild(newDiv);}
}

//This function will dynamically generate a list of destination stations
function destStation(){
    var xmlhttp, xmlDoc;
xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V", false);//AJAX request to obtain XML of stations list
xmlhttp.send();
xmlDoc = xmlhttp.responseXML;
    //debugger
    var len = xmlDoc.childNodes[0].childNodes[1].childNodes.length; //obtain the length of the array containing names of stations
    var newDiv = document.createElement('div');
    var select = '<select id="destName">';
    
    for (var i=0; i<len; i++){
        var destName = xmlDoc.childNodes[0].childNodes[1].childNodes[i].childNodes[0].childNodes[0].nodeValue; //Station name
        var abbr = xmlDoc.childNodes[0].childNodes[1].childNodes[i].childNodes[1].childNodes[0].nodeValue;// Station abbreviation
        var lat = xmlDoc.childNodes[0].childNodes[1].childNodes[i].childNodes[2].childNodes[0].nodeValue;//Station Latitiude
        var lng = xmlDoc.childNodes[0].childNodes[1].childNodes[i].childNodes[3].childNodes[0].nodeValue;//Station Longitude
        select +='<option value='+abbr+' lat='+lat+' lng='+lng+'>'+destName+'</option>';// <option value=abbreviaton lat=latitude long=longitude> StationName </option>
    }
    select += "</select>";
    newDiv.innerHTML = select;
    var k = document.getElementById("dest");
     if(k!=null)
    {k.appendChild(newDiv);}
}

var timeDiff;
var map;
var directionsDisplay;
var directionsService;
var departTimes = []; 
var inter1, inter2;
//var count=30;

//submit function will run when the submit button is clicked. This will refresh the time remaining for the arrival of next train as well as update the map with the desired path
function submitFunc()
{
departTimes = []; //array to cache the departure times when the user selects the station
clearInterval(inter1);    
document.getElementById('table').innerHTML=" ";
var source = document.getElementById('origName'); //get the origin station value
var dest = document.getElementById('destName'); //get the destination station value
var xmlhttp, xmlDoc;
xmlhttp = new XMLHttpRequest();
//AJAX request to get XML for arrival times
xmlhttp.open("GET", "http://api.bart.gov/api/sched.aspx?cmd=depart&orig="+ source.value+"&dest="+dest.value+"&date=now&key=MW9S-E7SL-26DU-VV8V", false);
xmlhttp.send();
xmlDoc = xmlhttp.responseXML;
    
document.getElementById('stations').innerHTML = "Schedule for next trains from "+source.options[source.selectedIndex].text+" to "+dest.options[dest.selectedIndex].text+" are as follows: ";
//Generate a dynamic table of a list of trains arriving after the current time
    var table = document.createElement('table');
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    
    td1.appendChild(document.createTextNode('Departure Time'));
    tr.appendChild(td1);
    td2.appendChild(document.createTextNode('Arrival Time'));
    tr.appendChild(td2);
    td3.appendChild(document.createTextNode('Fare'));
    tr.appendChild(td3);
    table.appendChild(tr);
    var fare = xmlDoc.childNodes[0].childNodes[4].childNodes[4].childNodes[0].getAttribute('fare');
    
    for(var i =2; i<4; i++){
        var arrive = xmlDoc.childNodes[0].childNodes[4].childNodes[4].childNodes[i].getAttribute('destTimeMin'); //Get the arrival time
        var depart = xmlDoc.childNodes[0].childNodes[4].childNodes[4].childNodes[i].getAttribute('origTimeMin'); // Get the departure time
        departTimes.push(depart); //Cache the the departure times for calculation of remaining time in the functions below.
        var tr1 = document.createElement('tr');
        var td4 = document.createElement('td');
        var td5 = document.createElement('td');
        var td6 = document.createElement('td'); 
        td4.appendChild(document.createTextNode(depart));
        td5.appendChild(document.createTextNode(arrive));
        td6.appendChild(document.createTextNode(fare));
        tr1.appendChild(td4);
        tr1.appendChild(td5);
        tr1.appendChild(td6);
        table.appendChild(tr1);
    }
    
    inter1 = setInterval(convertToSeconds,1000); //Update the remaining time every second by setting an interval every second
    clearInterval(inter2);
    document.getElementById('table').appendChild(table);
    
    var oSelect = source.options[source.selectedIndex]; //object to store the selected origin
    oriLat = oSelect.getAttribute('lat'); //obtain the attribut 'lat' for origin
    oriLng = oSelect.getAttribute('lng'); //obtain the longitude 'long' for origin
    var dSelect = dest.options[dest.selectedIndex];//object to store the selected destination
    destLat = dSelect.getAttribute('lat');//obtain the attribut 'lat' for destination
    destLng = dSelect.getAttribute('lng'); //obtain the longitude 'long' for destination
       
    var oCenter = new google.maps.LatLng(oriLat,oriLng); //Origin coordinates

    var dCenter = new google.maps.LatLng(destLat,destLng);//Destination coordinates

  directionsDisplay.setMap(map); //display the map using map object
  calculateAndDisplayRoute(directionsService, directionsDisplay, oCenter, dCenter);// Display the desired path on the map
   
}

var wait = false;
//This function displays the route from the source to the destination on the map
function calculateAndDisplayRoute(directionsService, directionsDisplay, oCenter, dCenter) {
    while(wait){}; 
    directionsService.route({
    origin: oCenter,  //origin center
    destination: dCenter,  //Destination center
    travelMode: google.maps.TravelMode.TRANSIT //type of travel = transit
  }, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response); 
        inter2 = setInterval(submitFunc,30000); //refresh the map every 30 seconds
         
    } else if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) { 
        wait = true;
        setTimeout("wait = true", 2000);
        //clearInterval(inter2);
        }
        else {
        //clearInterval(inter2);
      window.alert('Directions request failed due to ' + status);
    }
  });
}
 
//This function is used for initial set up of the map
function initialize() {

 directionsDisplay = new google.maps.DirectionsRenderer; //create an object for directions display
 directionsService = new google.maps.DirectionsService; //object for direction service
 myCenter = new google.maps.LatLng(37.8049,-122.2951); //default map location to display when page loads
 map = new google.maps.Map(document.getElementById("googleMap"), { // map object with default map location 
    zoom: 10,
    center: myCenter
  });
}
var ind = 0;

//This function calculates the time remaining for the next train to arrive at the selected station
function convertToSeconds(){
    var hms = departTimes[ind];   // your input string
    var a = hms.split(":"); // split it at the colons
    var b = a[1].split(" "); // split it at " " to  obtain an array b[2]=[time AM/PM]

    var dSeconds = (+a[0]) * 60 * 60 + (+b[0]) * 60; //calculate the total seconds 
    
    if(b[1]=='PM'){
        dSeconds += 12*60*60; //add 12 hours if PM
    };
    
    var d = new Date(); 
    var s = d.toString();
    var curr = s.split(" ");
    var time = curr[4].split(":"); 
    var cSeconds = (+time[0]) * 60 * 60 + (+time[1]) * 60 + (+time[2])*1 ; //gives time in 24 hour format
    timeDiff = dSeconds-cSeconds; //calculate remaining time
    
    //If time difference>0, train has not yet arrived, continue
    if(timeDiff>0){
        //flag =1;
        ind=0;
    }
    //Train has arrived, refresh the page with updated table, stop the current interval and reset timer
    else if(timeDiff<=0){
        clearInterval(inter1);
        clearInterval(inter2);
        ind=1;
        inter2 = setInterval(submitFunc,30000);
        //flag=1;
    }
    
    //Convert seconds in h:m:s format for displaying
    var hours= parseInt( timeDiff / 3600 ) % 24;
    var mins = parseInt( timeDiff / 60 ) % 60;
    var secs = timeDiff % 60;
    if(hours>=0 && mins>=0 && secs>=0){
    document.getElementById("countdown").innerHTML="Time for next Train: "+hours+"h :"+mins+"m :"+secs+"s";
    }
    
    if(hours<=0 && mins<=0 && secs<=0){ 
        document.getElementById("countdown").innerHTML="Train has arrived at the Station";
    }
}


