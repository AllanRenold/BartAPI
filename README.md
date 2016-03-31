# REST Web Service Client and User Interfaces

A website that uses JavaScript to obtain input from a remote source and display this input.

TASK 1: Obtaining and parsing XML

In this task, the BART API (Links to an external site.) will be used. 
Using its API documentation (link), find the resource that enables access to BART's real-time departure estimates. 
Using this resource, create a website that:

1) Uses the modern HTML Symantec tags. The following HTML5 elements must be included in the page:

  	a) Header
  
  	b) Section
  
  	c) Aside
  
  	d) Headings (h1, h2, etc.) g)
  
  	e) Footer
  
2) Use BART general-use API key: MW9S-E7SL-26DU-VV8V

3) Get a list of BART stations using BART API

4) Have the user select a departure station and arrival station

5) Display a list that includes

  	a) Real Time Departure time for trains to the destination station
  
	 	b) Fare (for each train route listed)
  
  	c) Time of arrival
  
6) Display a countdown (in steps of seconds) until the next train leaves toward arrival station.

7) Your website should update itself by re-loading the latest information from the BART API every 30 seconds.


TASK 2: I know you

When loaded, the web page will display a message welcoming a user back to your site if he or she has visited your page on the browser before. 

In that case the welcome message will include the number of times this user visited your site.


TASK 3: Display Google route map

1) Register for API google maps key (you can choose the standard plan for free)

2) Use google maps JavaScript API and research how to do routing maps using public transit

		a) https://developers.google.com/maps/documentation/javascript/directions

3) On the page, display a google map of the route taken by the next departing train from departure station.

  	You will need:
  	
    a) the departure time of next train that you got in previous step
    
    b) The longitude & latitude of both stations (see Station Information BART API)
    
