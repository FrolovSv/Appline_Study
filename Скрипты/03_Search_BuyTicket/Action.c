Action()
{
//	int numpass = 0;
//	
//	numpass = atoi(lr_eval_string("{numPassengers}");
//	   
	
	lr_start_transaction("03_Search_BuyTicket");
	
		//SLA 5 секунд ожидание действия пользователя
		lr_think_time(5);
		
		
		lr_start_transaction("goto_Flight");		
			//Проверка соответсвия на корректности загрузки страницы
			web_reg_find("Text=Web Tours Navigation Bar",
			LAST);
			
			web_url("welcome.pl", 
				"URL=http://localhost:1080/cgi-bin/welcome.pl?page=search", 
				"TargetFrame=", 
				"Resource=0", 
				"RecContentType=text/html", 
				"Referer=http://localhost:1080/cgi-bin/nav.pl?page=menu&in=home", 
				"Snapshot=t12.inf", 
				"Mode=HTML", 
				LAST);		
		lr_end_transaction("goto_Flight",LR_AUTO);
	
		//SLA 5 секунд ожидание действия пользователя
		lr_think_time(26);
	
		lr_start_transaction("Entry_Data_Flight");	
			//Проверка соответсвия на корректности загрузки страницы
			web_reg_find("Search=Body",
				"Text=From {depart}",
				LAST);
			web_reg_find("Search=Body",
				"Text=To {arrive}",
				LAST);
			
			/*Correlation comment - Do not change!  Original value='202;600;07/16/2020' Name ='outboundFlight' Type ='ResponseBased'*/
			web_reg_save_param_attrib(
				"ParamName=outboundFlight",
				"TagName=input",
				"Extract=value",
				"Name=outboundFlight",
				"Type=radio",
				SEARCH_FILTERS,
				"IgnoreRedirections=No",
				LAST);
			
			/*Correlation comment - Do not change!  Original value='022;600;09/17/2020' Name ='returnFlight' Type ='ResponseBased'*/
			web_reg_save_param_attrib(
				"ParamName=returnFlight",
				"TagName=input",
				"Extract=value",
				"Name=returnFlight",
				"Type=radio",
				SEARCH_FILTERS,
				"IgnoreRedirections=No",
				LAST);
			
			web_submit_data("reservations.pl",
				"Action=http://localhost:1080/cgi-bin/reservations.pl", 
				"Method=POST", 
				"TargetFrame=", 
				"RecContentType=text/html", 
				"Referer=http://localhost:1080/cgi-bin/reservations.pl?page=welcome", 
				"Snapshot=t4.inf", 
				"Mode=HTML", 
				ITEMDATA, 
				"Name=advanceDiscount", "Value=0", ENDITEM, 
				"Name=depart", "Value={depart}", ENDITEM, 
				"Name=departDate", "Value={departDate}", ENDITEM, 
				"Name=arrive", "Value={arrive}", ENDITEM, 
				"Name=returnDate", "Value={returnDate}", ENDITEM, 
				"Name=numPassengers", "Value={numPassengers}", ENDITEM, // количество пассажиров оставлю 2 
				"Name=roundtrip", "Value={roundtrip}", ENDITEM, 
				"Name=seatPref", "Value={seatPref}", ENDITEM, 
				"Name=seatType", "Value={seatType}", ENDITEM, 
				"Name=.cgifields", "Value=roundtrip", ENDITEM, 
				"Name=.cgifields", "Value=seatType", ENDITEM, 
				"Name=.cgifields", "Value=seatPref", ENDITEM, 
				"Name=findFlights.x", "Value=58", ENDITEM, 
				"Name=findFlights.y", "Value=9", ENDITEM, 
				LAST);	
		lr_end_transaction("Entry_Data_Flight",LR_AUTO);
		
		//SLA 5 секунд ожидание действия пользователя
		lr_think_time(20);
	
		lr_start_transaction("choise_ticket");	
			//Проверка соответсвия на корректности загрузки страницы
			web_reg_find("Text=Flight Reservation",
            	LAST);
			web_submit_data("reservations.pl_2",
				"Action=http://localhost:1080/cgi-bin/reservations.pl",
				"Method=POST",
				"TargetFrame=",
				"RecContentType=text/html",
				"Referer=http://localhost:1080/cgi-bin/reservations.pl",
				"Snapshot=t5.inf",
				"Mode=HTML",
				ITEMDATA,
				"Name=outboundFlight", "Value={outboundFlight}", ENDITEM,
				"Name=returnFlight", "Value={returnFlight}", ENDITEM,
				"Name=numPassengers", "Value={numPassengers}", ENDITEM,
				"Name=advanceDiscount", "Value=0", ENDITEM,
				"Name=seatType", "Value={seatType}", ENDITEM,
				"Name=seatPref", "Value={seatPref}", ENDITEM,
				"Name=reserveFlights.x", "Value=60", ENDITEM,
				"Name=reserveFlights.y", "Value=8", ENDITEM,
				LAST);	
		lr_end_transaction("choise_ticket",LR_AUTO);
		
		//SLA 5 секунд ожидание действия пользователя
		lr_think_time(60);
	
		lr_start_transaction("Entry_Data_Ticket");
			//Проверка соответсвия на корректности загрузки страницы
			web_reg_find("Text=Reservation Made!",
            	LAST);		
			
//			if (numpass>2){
//			   
//			}else{
//			   
//			}
//			
			web_submit_data("reservations.pl_3",
				"Action=http://localhost:1080/cgi-bin/reservations.pl",
				"Method=POST",
				"TargetFrame=",
				"RecContentType=text/html",
				"Referer=http://localhost:1080/cgi-bin/reservations.pl",
				"Snapshot=t6.inf",
				"Mode=HTML",
				ITEMDATA,
				"Name=firstName", "Value={User_Name}", ENDITEM,
				"Name=lastName", "Value={User_FirstName}", ENDITEM,
				"Name=address1", "Value={User_Street}", ENDITEM,
				"Name=address2", "Value={User_Sity}", ENDITEM,
				"Name=pass1", "Value={Pass_FirstName} {Pass_Name}", ENDITEM,
				"Name=creditCard", "Value={CreditCard_Num}", ENDITEM,
				"Name=expDate", "Value={CreditCard_Val}", ENDITEM,
				"Name=oldCCOption", "Value=on", ENDITEM,
				"Name=numPassengers", "Value={numPassengers}", ENDITEM,
				"Name=seatType", "Value={seatType}", ENDITEM,
				"Name=seatPref", "Value={seatPref}", ENDITEM,
				"Name=outboundFlight", "Value={outboundFlight}", ENDITEM,
				"Name=advanceDiscount", "Value=0", ENDITEM,
				"Name=returnFlight", "Value={returnFlight}", ENDITEM,
				"Name=JSFormSubmit", "Value=off", ENDITEM,
				"Name=.cgifields", "Value=saveCC", ENDITEM,
				"Name=buyFlights.x", "Value=41", ENDITEM,
				"Name=buyFlights.y", "Value=8", ENDITEM,
				LAST);	
		lr_end_transaction("Entry_Data_Ticket",LR_AUTO);
		
		//SLA 5 секунд ожидание действия пользователя
		lr_think_time(15);
	
		lr_start_transaction("goto_home");	
			//Проверка соответсвия на корректности загрузки страницы
			web_reg_find("Text=User has returned to the home page.",
				LAST);		
			web_url("welcome.pl", 
				"URL=http://localhost:1080/cgi-bin/welcome.pl?page=menus", 
				"TargetFrame=", 
				"Resource=0", 
				"RecContentType=text/html", 
				"Referer=http://localhost:1080/cgi-bin/nav.pl?page=menu&in=flights", 
				"Snapshot=t7.inf", 
				"Mode=HTML", 
				LAST);		
		lr_end_transaction("goto_home",LR_AUTO);
	
	lr_end_transaction("03_Search_BuyTicket", LR_AUTO);


	return 0;
}