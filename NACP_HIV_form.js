$(document).ready(function(){
    // instanciate various class each for specific purpose
  var autoCalculate			= {};
  var orgUnit = dhis2.de.currentOrganisationUnitId;
  var dataSet = $('#selectedDataSetId').val();
  var dataSetPeriod=$('#selectedPeriodId').val();
  console.log("Period Selected");
  console.log(dataSetPeriod);
  autoCalculate.getLastQuarterPeriod = function(thisQuarterPeriod){
	  this.thisQuarterPeriod = thisQuarterPeriod;
	  var quarterArray = this.thisQuarterPeriod.split("Q");
	  console.log(parseInt(quarterArray[1]));
	  switch(parseInt(quarterArray[1])){
    case 1: 
		return (parseInt(quarterArray[0])-1)+"Q4";
    break;
    case 2: 
		return quarterArray[0]+"Q1";
    break;
    case 3:
		return quarterArray[0]+"Q2";
    break;
    case 4: 
		return quarterArray[0]+"Q3";
    break;
		  }
	  }
	  
 autoCalculate.sumUpQuarterData = function(){
	  var lastQuarterPeriod = autoCalculate.getLastQuarterPeriod(dataSetPeriod);
	  lastQuarterUrl = "/api/dataValueSets.json?dataSet="+dataSet+"&period="+lastQuarterPeriod+"&orgUnit="+orgUnit;
	  thisQuarterUrl = "/api/dataValueSets.json?dataSet="+dataSet+"&period="+dataSetPeriod+"&orgUnit="+orgUnit;
		$.ajax({
                    type: "GET", 		//GET or POST or PUT or DELETE verb
                    url: lastQuarterUrl, 		// Location of the service
                    dataType: "json", 	//Expected data format from server
                    success: function (dataLastQuarter) {//On Successful service call
						
	    $.ajax({
                    type: "GET", 		//GET or POST or PUT or DELETE verb
                    url: thisQuarterUrl, 		// Location of the service
                    dataType: "json", 	//Expected data format from server
                    success: function (dataThisQuarter) {//On Successful service call
						
						console.log("This Quarter");
						console.log(dataThisQuarter.dataValues);
						console.log("Last Quarter");
						console.log(dataLastQuarter.dataValues);
					},
					error: function (xhr, textStatus, errorThrown) {
							if (409 == xhr.status || 500 == xhr.status) // Invalid value or locked
							{
								//markValue(fieldId, dhis2.de.cst.colorRed);
								setHeaderDelayMessage(xhr.responseText);
							}
							else // Offline, keep local value
							{
							}
					}// When Service call fails
		}); 					
						
                    },
                    error: function (xhr, textStatus, errorThrown) {
							if (409 == xhr.status || 500 == xhr.status) // Invalid value or locked
							{
								//markValue(fieldId, dhis2.de.cst.colorRed);
								setHeaderDelayMessage(xhr.responseText);
							}
							else // Offline, keep local value
							{
							}
					}// When Service call fails
		});
	 
	  }	  
	  
 autoCalculate.getThisQuarterData = function(){
	  
	  }	 
	  

  autoCalculate.sniffOnlineOffline = function (){
	  var networkTracker = 1;
	  url = "../dhis-web-commons-stream/ping.action";
	  setInterval(function(){
		  
		  $.ajax({
                    type: "GET", 		//GET or POST or PUT or DELETE verb
                    url: url, 		// Location of the service
                    dataType: "json", 	//Expected data format from server
                    success: function (data) {//On Successful service call
						
							autoCalculate.sumUpQuarterData(); 
						
						
                    },
                    error: function (xhr, textStatus, errorThrown) {
							if (409 == xhr.status || 500 == xhr.status) // Invalid value or locked
							{
								//markValue(fieldId, dhis2.de.cst.colorRed);
								setHeaderDelayMessage(xhr.responseText);
							}
							else // Offline, keep local value
							{
                                ///setHeaderDelayMessage("some thing is ");
								//markValue(fieldId, resultColor);
								setHeaderDelayMessage("Your offline auto sum will run next time your online");
							}
					}// When Service call fails
		});	  
		  
		},1000);
	  	}
	  autoCalculate.sniffOnlineOffline();
});
