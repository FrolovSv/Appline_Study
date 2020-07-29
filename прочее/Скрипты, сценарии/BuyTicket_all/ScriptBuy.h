void BuyTicket()
{
	
	
	//lr_start_transaction("goto_Flight");
			//Проверка соответсвия на корректности загрузки страницы
			web_reg_find("Text=Find Flight",
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
	//lr_end_transaction("goto_Flight",LR_AUTO);
	
	
	//lr_start_transaction("Entry_Data_Flight");		
			//Проверка соответсвия на корректность загрузки страницы
			web_reg_find("Text=Flight departing from <B>{depart}</B> to <B>{arrive}</B>",
				LAST);
			if (lr_eval_string("{roundtrip}")=="on"){
				web_reg_find("Text=Flight departing from <B>{arrive}</B> to <B>{depart}</B>",
					LAST);
		    }
			
			
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
	//lr_end_transaction("Entry_Data_Flight",LR_AUTO);
		
	//lr_start_transaction("choise_ticket");
			//Проверка соответсвия на корректность загрузки страницы
			web_reg_find("Search=Body",
				"Text=Flight Reservation",
				LAST);	
			web_reg_find("Search=Body",
				"Text={Name}",
				LAST);
			web_reg_find("Search=Body",
				"Text={FirstName}",
				LAST);			
						
			lr_output_message(lr_eval_string("outboundFlight  - {outboundFlight}"));
			
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
		//lr_end_transaction("choise_ticket",LR_AUTO);
		
	
		//lr_start_transaction("Entry_Data_Ticket");
			//Проверка соответсвия на корректность загрузки страницы
			web_reg_find("Search=Body",
				"Text=Thank you for booking through Web Tours.",
				LAST);
			web_reg_find("Search=Body",
				"Text=from {depart} to {arrive}.",
				LAST);				
		
			web_submit_data("reservations.pl_8",
				"Action=http://localhost:1080/cgi-bin/reservations.pl",
				"Method=POST",
				"TargetFrame=",
				"RecContentType=text/html",
				"Referer=http://localhost:1080/cgi-bin/reservations.pl",
				"Snapshot=t6.inf",
				"Mode=HTML",
				ITEMDATA,
				"Name=firstName", "Value={Name}", ENDITEM,
				"Name=lastName", "Value={FirstName}", ENDITEM,
				"Name=address1", "Value={Street}", ENDITEM,
				"Name=address2", "Value={Sity}", ENDITEM,
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
		//lr_end_transaction("Entry_Data_Ticket",LR_AUTO);
		
		lr_output_message(lr_eval_string("{user}"));
		lr_output_message(lr_eval_string("{Pass_FirstName}"));
		lr_output_message(lr_eval_string("{Pass_Name}"));

	
	
	//return 0;
}

void vuser_login()
{
	
	web_reg_save_param_ex(
			"ParamName=userSession",
			"LB=name=\"userSession\" value=\"",
			"RB=\"/>",
			"Ordinal=1",
				SEARCH_FILTERS,
			LAST);	

		//Проверка соответсвия на корректности загрузки страницы
		web_reg_find("Text=Welcome to the Web Tours site", LAST);
		
		web_url("WebTours",
			"URL=http://localhost:1080/WebTours/", 
			"TargetFrame=", 
			"Resource=0", 
			"RecContentType=text/html", 
			"Referer=", 
			"Snapshot=t1.inf", 
			"Mode=HTML", 
			LAST);		
		//lr_end_transaction("Load_start_Page", LR_AUTO);

			//Проверка соответсвия на корректности загрузки страницы
			web_reg_find("Text=User password was correct", LAST);
			
			web_submit_data("login.pl",
				"Action=http://localhost:1080/cgi-bin/login.pl",
				"Method=POST",
				"TargetFrame=body",
				"RecContentType=text/html",
				"Referer=http://localhost:1080/cgi-bin/nav.pl?in=home",
				"Snapshot=t2.inf",
				"Mode=HTML",
				ITEMDATA,
				"Name=userSession", "Value={userSession}", ENDITEM,
				"Name=username", "Value={User_Login}", ENDITEM,
				"Name=password", "Value={User_Pass}", ENDITEM,
				"Name=JSFormSubmit", "Value=off", ENDITEM,
				"Name=login.x", "Value=60", ENDITEM,
				"Name=login.y", "Value=9", ENDITEM,
				LAST);		
			//web_set_sockets_option("SSL_VERSION", "AUTO");	

			lr_save_string(lr_eval_string("{User_Login}"), "user");
			lr_save_string(lr_eval_string("{User_Pass}"), "pass");
			lr_save_string(lr_eval_string("{User_Name}"), "Name");
			lr_save_string(lr_eval_string("{User_FirstName}"), "FirstName");
			lr_save_string(lr_eval_string("{User_Sity}"), "Sity");
			lr_save_string(lr_eval_string("{User_Street}"), "Street");

			lr_output_message(lr_eval_string("{User_Login}"));
	
	//return 0;
}

void vuser_logout()
{
	//lr_start_transaction("Logout");
		
			//Проверка соответсвия на корректности загрузки страницы
			web_reg_find("Text=To make reservations,please enter your account information to the left.",
				LAST);
			web_url("welcome.pl",
				"URL=http://localhost:1080/cgi-bin/welcome.pl?signOff=1", 
				"TargetFrame=", 
				"Resource=0", 
				"RecContentType=text/html", 
				"Referer=http://localhost:1080/cgi-bin/nav.pl?page=menu&in=home", 
				"Snapshot=t9.inf", 
				"Mode=HTML", 
				LAST);
		//lr_end_transaction("Logout", LR_AUTO);
	
	//return 0;
}

