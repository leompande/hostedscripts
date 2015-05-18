$(document).ready(function(){
    // instanciate various class each for specific purpose
  var autoCalculate			= {};
  var orgUnit = dhis2.de.currentOrganisationUnitId;
  var dataSet = $('#selectedDataSetId').val();
  var dataSetPeriod=$('#selectedPeriodId').val();
    $('#selectedPeriodId').bind("change",function(){
        dataSet = $('#selectedDataSetId').val();
        dataSetPeriod=$('#selectedPeriodId').val();
    });
  autoCalculate.getLastQuarterPeriod = function(thisQuarterPeriod){
	  this.thisQuarterPeriod = thisQuarterPeriod;
	  var quarterArray = this.thisQuarterPeriod.split("Q");
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
                        autoCalculate.formatLastQuarterData33Death(dataLastQuarter);
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
    autoCalculate.getSubId = function(rowId){
        var rowIdArray = rowId.split("-");
        var subId = rowIdArray[1]+"-"+rowIdArray[2];
        return subId;
    }
    autoCalculate.formatLastQuarterData211 = function(dataLastQuarter){

        if(dataLastQuarter.dataValues){
            $.each(dataLastQuarter.dataValues,function(indexLastQuarter,valueLastQuarter){
                if(valueLastQuarter.dataElement =="ZDEAnnS7BO0"){
                    var index = valueLastQuarter.dataElement+"-"+valueLastQuarter.categoryOptionCombo+"-val";
                        window.cellObject211[index] = parseInt(valueLastQuarter.value);

                }
            });
        }else{

        }

    }
    autoCalculate.formatLastQuarterData33Death = function(dataLastQuarter){
        if(dataLastQuarter.dataValues){
            $.each(dataLastQuarter.dataValues,function(indexLastQuarter,valueLastQuarter){
                if(valueLastQuarter.dataElement =="Z4aNGrX9ZuC"){
                    //var index = valueLastQuarter.dataElement+"-"+valueLastQuarter.categoryOptionCombo+"-val";
                    //window.cellObject211[index] = parseInt(valueLastQuarter.value);

                    console.log(valueLastQuarter);

                }
            });
        }else{

        }
    }
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

        window.cellObject211 = {"totalZDEAnnS7BO0":0,"indicatorrtLNTzPIEEp":0,"ZDEAnnS7BO0-nehCW5s6Hx4-val":0,"ZDEAnnS7BO0-ttFf9vc6pnB-val":0,"ZDEAnnS7BO0-Xns0ysCNhcv-val":0,"ZDEAnnS7BO0-OKxxCNhyCrd-val":0,"indicatorEiyef1C8q6i":0,"ZDEAnnS7BO0-IR5epaaFjxT-val":0,"ZDEAnnS7BO0-YpFuX3wm6r8-val":0,"ZDEAnnS7BO0-cmlhcvPcdol-val":0,"ZDEAnnS7BO0-KmmKuXofUzA-val":0,"X0CIZT6HSEo-uGIJ6IdkP7Q-val":0};
        window.cellObject22  = {"totalItgPHCQ1hm6":0,"indicatorvGbgnXHsvVl":0,"ItgPHCQ1hm6-nehCW5s6Hx4-val":0,"ItgPHCQ1hm6-ttFf9vc6pnB-val":0,"ItgPHCQ1hm6-Xns0ysCNhcv-val":0,"ItgPHCQ1hm6-OKxxCNhyCrd-val":0,"indicatorWOYihHyMv7d":0,"ItgPHCQ1hm6-IR5epaaFjxT-val":0,"ItgPHCQ1hm6-YpFuX3wm6r8-val":0,"ItgPHCQ1hm6-cmlhcvPcdol-val":0,"ItgPHCQ1hm6-KmmKuXofUzA-val":0,"xVbmMwUk5ug-uGIJ6IdkP7Q-val":0,"Wcsc9U3fMIx-uGIJ6IdkP7Q-val":0};
        window.cellObject210 = {"totalnJPIfVSHB3O":0,"indicatorUrPbNJ7oJvQ":0,"nJPIfVSHB3O-nehCW5s6Hx4-val":0,"nJPIfVSHB3O-ttFf9vc6pnB-val":0,"nJPIfVSHB3O-Xns0ysCNhcv-val":0,"nJPIfVSHB3O-OKxxCNhyCrd-val":0,"indicatorsvW4HkckDQr":0,"nJPIfVSHB3O-IR5epaaFjxT-val":0,"nJPIfVSHB3O-YpFuX3wm6r8-val":0,"nJPIfVSHB3O-cmlhcvPcdol-val":0,"nJPIfVSHB3O-KmmKuXofUzA-val":0,"fJafOIjKvRu-uGIJ6IdkP7Q-val":0};
        window.thisQuarter211 = window.cellObject211;
        $.each(window.cellObject22,function(indexThisQuarter,valueThisQuarter){
            if(indexThisQuarter.indexOf("-val")>=0){
                var inputValue = $("input#"+indexThisQuarter).val();
                if(isNaN(parseInt(inputValue))){
                    window.cellObject22[indexThisQuarter] = 0;
                }else{
                    window.cellObject22[indexThisQuarter] = parseInt(inputValue);
                }


            }
            });
        $.each(window.cellObject210,function(indexThisQuarter,valueThisQuarter){
            if(indexThisQuarter.indexOf("-val")>=0){
                var inputValue = $("input#"+indexThisQuarter).val();
                var inputValue2 = $("input#fJafOIjKvRu-uGIJ6IdkP7Q-val").val();
                if(isNaN(parseInt(inputValue))){
                    window.cellObject210[indexThisQuarter] = 0;
                }else{
                    //console.log(parseInt(inputValue));
                    window.cellObject210[indexThisQuarter] = parseInt(inputValue);
                    window.cellObject210["fJafOIjKvRu-uGIJ6IdkP7Q-val"] = parseInt(inputValue);
                }
            }
        });
        autoCalculate.formatLastQuarterData211(dataLastQuarter);
        $.each(window.thisQuarter211,function(indexThisQuarter,valueThisQuarter){
            var idArray = indexThisQuarter.split("-");
            if(indexThisQuarter.indexOf("-val")>=0){
                var a=0, b=0,c=0;
                if(typeof window.cellObject211[indexThisQuarter] == "undefined"){
                }else{

                    if(isNaN(window.cellObject210["nJPIfVSHB3O-"+autoCalculate.getSubId(indexThisQuarter)])){}else{a=parseInt(window.cellObject210["nJPIfVSHB3O-"+autoCalculate.getSubId(indexThisQuarter)]);window.cellObject210["fJafOIjKvRu-uGIJ6IdkP7Q-val"];}
                    if(isNaN(window.cellObject22["ItgPHCQ1hm6-"+autoCalculate.getSubId(indexThisQuarter)])){}else{b=parseInt(window.cellObject22["ItgPHCQ1hm6-"+autoCalculate.getSubId(indexThisQuarter)]);window.cellObject22["xVbmMwUk5ug-uGIJ6IdkP7Q-val"];}
                    if(isNaN(window.cellObject211["ZDEAnnS7BO0-"+autoCalculate.getSubId(indexThisQuarter)])){}else{c=parseInt(window.cellObject211["ZDEAnnS7BO0-"+autoCalculate.getSubId(indexThisQuarter)]);window.cellObject211["X0CIZT6HSEo-uGIJ6IdkP7Q-val"];}
                    window.thisQuarter211[""+autoCalculate.getSubId(indexThisQuarter)] = parseInt(c+b+a);
                    $("input#"+indexThisQuarter).val(parseInt(c+b+a))
                }

            }
        });
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


    }
});
