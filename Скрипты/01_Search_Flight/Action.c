Action()
{
	//Для того, чтобы не было совпадения города вылета с городом прилета, 
	//убрал из переменной со списком городов прибытия город Denver
	
	lr_start_transaction("01_Search_Flight");
	
		//SLA 5 секунд ожидание действия пользователя
		lr_think_time(5);		
		
		lr_start_transaction("goto_Flight");		
			//Проверка соответсвия на корректность загрузки страницы
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
		lr_end_transaction("goto_Flight",LR_AUTO);
	
		//SLA 26 секунд на ввод всех данных в форму на странице
		lr_think_time(26);
	
		lr_start_transaction("Entry_Data_Flight");		
			//Проверка соответсвия на корректность загрузки страницы
			web_reg_find("Text=Flight departing from <B>{depart}</B> to <B>{arrive}</B>",
				LAST);
			if (lr_eval_string("{roundtrip}")=="on"){
				web_reg_find("Text=Flight departing from <B>{arrive}</B> to <B>{depart}</B>",
					LAST);
		    }	
						
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
	
		//SLA 15 секунд ожидание действий пользователя
		lr_think_time(15);
		
		lr_start_transaction("goto_home");
			//Проверка соответсвия на корректность загрузки страницы
			web_reg_find("Text=Welcome, <b>{User_Login}</b>, to the Web Tours reservation pages.",
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
	
	lr_end_transaction("01_Search_Flight", LR_AUTO);


	return 0;
}