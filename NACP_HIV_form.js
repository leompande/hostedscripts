$(document).ready(function(){
    // instanciate various class each for specific purpose
  var autoCalculate			= {};
  var orgUnit = dhis2.de.currentOrganisationUnitId;
  var dataSet = $('#selectedDataSetId').val();
  var dataSetPeriod=$('#selectedPeriodId').val();
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

                        autoCalculate.produceTotal(dataThisQuarter,dataLastQuarter);

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

    autoCalculate.produceTotal = function(dataThisQuarter,dataLastQuarter){

        //Auto Calculate: 2.11 = 2.11(lQ)+2.2(tQ)+2.10(tQ) from PMTC
        /**
         *	this is the variable that carries calculated value from formular
         *	Auto Calculate: 2.11 = 2.11(lQ)+2.2(tQ)+2.10(tQ) from PMTC
         */
        var resultThisQuarter = null;


        /**
         *	this is the variable that carries  value of 2.11(lQ) from formular
         *	Auto Calculate: 2.11 = 2.11(lQ)+2.2(tQ)+2.10(tQ) from PMTC
         */
        var resultLastQuarter = null;


        /**
         *	this is the variable that carries  value of 2.2(tQ) from formular
         *	Auto Calculate: 2.11 = 2.11(lQ)+2.2(tQ)+2.10(tQ) from PMTC
         */

        var inputThisQuarter22 = null;


        /**
         *	this is the variable that carries  value of 2.10(tQ) from formular
         *	Auto Calculate: 2.11 = 2.11(lQ)+2.2(tQ)+2.10(tQ) from PMTC
         */

        var inputThisQuarter210 = null;

        autoCalculate.cellObject211 = {"totalZDEAnnS7BO0":null,"indicatorrtLNTzPIEEp":null,"ZDEAnnS7BO0-nehCW5s6Hx4-val":null,"ZDEAnnS7BO0-ttFf9vc6pnB-val":null,"ZDEAnnS7BO0-Xns0ysCNhcv-val":null,"ZDEAnnS7BO0-OKxxCNhyCrd-val":null,"indicatorEiyef1C8q6i":null,"ZDEAnnS7BO0-IR5epaaFjxT-val":null,"ZDEAnnS7BO0-YpFuX3wm6r8-val":null,"ZDEAnnS7BO0-cmlhcvPcdol-val":null,"ZDEAnnS7BO0-KmmKuXofUzA-val":null,"X0CIZT6HSEo-uGIJ6IdkP7Q-val":null};
        autoCalculate.cellObject22  = {"totalItgPHCQ1hm6":null,"indicatorvGbgnXHsvVl":null,"ItgPHCQ1hm6-nehCW5s6Hx4-val":null,"ItgPHCQ1hm6-ttFf9vc6pnB-val":null,"ItgPHCQ1hm6-Xns0ysCNhcv-val":null,"ItgPHCQ1hm6-OKxxCNhyCrd-val":null,"indicatorWOYihHyMv7d":null,"ItgPHCQ1hm6-IR5epaaFjxT-val":null,"ItgPHCQ1hm6-YpFuX3wm6r8-val":null,"ItgPHCQ1hm6-cmlhcvPcdol-val":null,"ItgPHCQ1hm6-KmmKuXofUzA-val":null,"xVbmMwUk5ug-uGIJ6IdkP7Q-val":null,"Wcsc9U3fMIx-uGIJ6IdkP7Q-val":null};
        autoCalculate.cellObject210 = {"totalnJPIfVSHB3O":null,"indicatorUrPbNJ7oJvQ":null,"nJPIfVSHB3O-nehCW5s6Hx4-val":null,"nJPIfVSHB3O-ttFf9vc6pnB-val":null,"nJPIfVSHB3O-Xns0ysCNhcv-val":null,"nJPIfVSHB3O-OKxxCNhyCrd-val":null,"indicatorsvW4HkckDQr":null,"nJPIfVSHB3O-IR5epaaFjxT-val":null,"nJPIfVSHB3O-YpFuX3wm6r8-val":null,"nJPIfVSHB3O-cmlhcvPcdol-val":null,"nJPIfVSHB3O-KmmKuXofUzA-val":null,"fJafOIjKvRu-uGIJ6IdkP7Q-val":null};
        autoCalculate.thisQuarter211 = autoCalculate.cellObject211;
        $.each(autoCalculate.cellObject22,function(indexThisQuarter,valueThisQuarter){
            if(indexThisQuarter.indexOf("-val")>=0){
                var inputValue = $("input#"+indexThisQuarter).val();
                autoCalculate.cellObject22[indexThisQuarter] = inputValue;

            }
            }).done(function(response){
                 console.log(response);
            });

        $.each(autoCalculate.cellObject210,function(indexThisQuarter,valueThisQuarter){
            if(indexThisQuarter.indexOf("-val")>=0){
                var inputValue = $("input#"+indexThisQuarter).val();
                autoCalculate.cellObject210[indexThisQuarter] = inputValue;
            }
        });

        $.each(dataLastQuarter,function(indexLastQuarter,valueLastQuarter){
            if(indexLastQuarter.indexOf("-val")>=0){
                var inputValue = $("input#"+indexLastQuarter).val();
                autoCalculate.cellObject211[indexLastQuarter] = inputValue;
            }
        });

        $.each(autoCalculate.thisQuarter211,function(indexThisQuarter,valueThisQuarter){
            var idArray = indexThisQuarter.split("-");
           //onsole.log(parseInt(autoCalculate.cellObject211[indexThisQuarter]));
            console.log(parseInt(autoCalculate.cellObject211));
            //nsole.log(parseInt(autoCalculate.cellObject210["ItgPHCQ1hm6-"+idArray[1]+"-val"]));
            console.log(parseInt(autoCalculate.cellObject210));
            //nsole.log(parseInt(autoCalculate.cellObject22["nJPIfVSHB3O-"+idArray[1]+"-val"]));
            console.log(parseInt(autoCalculate.cellObject22));
            if(indexThisQuarter.indexOf("-val")>=0){
                var inputValue = $("input#"+indexThisQuarter).val();
               // autoCalculate.thisQuarter211[indexThisQuarter] = parseInt(autoCalculate.cellObject211[indexThisQuarter])+parseInt(autoCalculate.cellObject210[indexThisQuarter])+parseInt(autoCalculate.cellObject22[indexThisQuarter]);

            }
        });
        //console.log(autoCalculate.thisQuarter211);
        /**
         if(dataThisQuarter.dataValues){
        $.each(dataThisQuarter.dataValues,function(indexThisQuarter,valueThisQuarter){

           // console.log($("input#"+valueThisQuarter.dataElement+"-"+valueThisQuarter.categoryOptionCombo+"-val").parent("td").parent("tr").find("td:first").text());
           // console.log($("input#"+valueThisQuarter.dataElement+"-"+valueThisQuarter.categoryOptionCombo+"-val").val());
        });
    }
         if(dataLastQuarter.dataValues){
        $.each(dataLastQuarter.dataValues,function(indexLastQuarter,valueLastQuarter){

           // console.log($("input#"+valueLastQuarter.dataElement+"-"+valueLastQuarter.categoryOptionCombo+"-val").parent("td").parent("tr").find("td:first").text());
           // console.log($("input#"+valueLastQuarter.dataElement+"-"+valueLastQuarter.categoryOptionCombo+"-val").val());
        });
    }
         */


        /**
         Hence Formular translation of Auto Calculate: 2.11 = 2.11(lQ)+2.2(tQ)+2.10(tQ) will be
         */

        resultThisQuarter = resultLastQuarter + inputThisQuarter22 + inputThisQuarter210;

    }
});
