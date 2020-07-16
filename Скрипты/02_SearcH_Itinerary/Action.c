Action()
{
	lr_start_transaction("02_Search_itinerary");
	
		//SLA 5 секунд ожидание действи€ пользовател€
		lr_think_time(5);			
			
		lr_start_transaction("goto_Flight");		
			
			//ѕроверка соответсви€ на корректности загрузки страницы
			web_reg_find("Text=Flight Selections",
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
		
		//SLA 26 секунд на ввод всех данных в форму на странице
		lr_think_time(26);
	
		lr_start_transaction("Entry_Data_Flight");
		
			//ѕроверка соответсви€ на корректности загрузки страницы
			web_reg_find("Text=Flight Selections",
			LAST);
			
			web_submit_data("reservations.pl", 
				"Action=http://localhost:1080/cgi-bin/reservations.pl", 
				"Method=POST", 
				"TargetFrame=", 
				"RecContentType=text/html", 
				"Referer=http://localhost:1080/cgi-bin/reservations.pl?page=welcome", 
				"Snapshot=t13.inf", 
				"Mode=HTML", 
				ITEMDATA, 
				"Name=advanceDiscount", "Value=0", ENDITEM, 
				"Name=depart", "Value={depart}", ENDITEM, 
				"Name=departDate", "Value={departDate}", ENDITEM, 
				"Name=arrive", "Value={arrive}", ENDITEM, 
				"Name=returnDate", "Value={returnDate}", ENDITEM, 
				"Name=numPassengers", "Value={numPassengers}", ENDITEM, 
				"Name=roundtrip", "Value={roundtrip}", ENDITEM, 
				"Name=seatPref", "Value={seatPref}", ENDITEM, 
				"Name=seatType", "Value={seatType}", ENDITEM, 
				"Name=.cgifields", "Value=roundtrip", ENDITEM, 
				"Name=.cgifields", "Value=seatType", ENDITEM, 
				"Name=.cgifields", "Value=seatPref", ENDITEM, 
				"Name=findFlights.x", "Value=52", ENDITEM, 
				"Name=findFlights.y", "Value=10", ENDITEM, 
				LAST);
				
		lr_end_transaction("Entry_Data_Flight",LR_AUTO);
		
			//SLA 15 секунд ожидание действий пользовател€
			lr_think_time(15);
	
		lr_start_transaction("goto_Itinerary");
	
			//ѕроверка соответсви€ на корректности загрузки страницы
			web_reg_find("Text=Flights List",
			LAST);
			
			web_url("Itinerary Button", 
				"URL=http://localhost:1080/cgi-bin/welcome.pl?page=itinerary", 
				"TargetFrame=body", 
				"Resource=0", 
				"RecContentType=text/html", 
				"Referer=http://localhost:1080/cgi-bin/nav.pl?page=menu&in=flights", 
				"Snapshot=t5.inf", 
				"Mode=HTML", 
				LAST);
	
		lr_end_transaction("goto_Itinerary",LR_AUTO);
		
		//SLA 15 секунд ожидание действий пользовател€
			lr_think_time(20);
		
		lr_start_transaction("goto_home");
			//ѕроверка соответсви€ на корректности загрузки страницы
			web_reg_find("Text=User has returned to the home page.",
				LAST);			
			web_url("welcome.pl", 
				"URL=http://localhost:1080/cgi-bin/welcome.pl?page=menus", 
				"TargetFrame=", 
				"Resource=0", 
				"RecContentType=text/html", 
				"Referer=http://localhost:1080/cgi-bin/nav.pl?page=menu&in=home", 
				"Snapshot=t16.inf", 
				"Mode=HTML", 
				LAST);
		
		lr_end_transaction("goto_home",LR_AUTO);
		
	lr_end_transaction("02_Search_itinerary", LR_AUTO);


	return 0;
}