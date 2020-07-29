Action3()
{
    int i;

    //<input type=hidden name=userSession value=108519.968084245ffiVQQfpifiDDDDDDDtQVpQHfVf>

    
    
//    web_reg_save_param("c_session",
//	    "lb=<input type=hidden name=userSession value=",
//	    "rb=>",
//	    LAST);
//
    lr_start_transaction("HomePage");
//
//	    web_url("WebTours",
//		    "URL=http://127.0.0.1:1080/WebTours/",
//		    "TargetFrame=",
//		    "Resource=0",
//		    "RecContentType=text/html",
//		    "Referer=",
//		    "Snapshot=t1.inf",
//		    "Mode=HTML",
//		    LAST);

	
			/*Correlation comment - Do not change!  Original value='129182.290643985zzttiVtpAHfDQizipiittf' Name ='userSession' Type ='ResponseBased'*/
			web_reg_save_param_attrib(
				"ParamName=c_session",
				"TagName=input",
				"Extract=value",
				"Name=userSession",
				"Type=hidden",
				SEARCH_FILTERS,
				"IgnoreRedirections=No",
				"RequestUrl=*/nav.pl*",
				LAST);
		
			//Проверка соответсвия на корректность загрузки страницы
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
					
//			//Проверка соответсвия на корректность загрузки страницы
//			web_reg_find("Text=User password was correct", LAST);
//		
//			web_submit_data("login.pl",
//				"Action=http://localhost:1080/cgi-bin/login.pl",
//				"Method=POST",
//				"TargetFrame=body",
//				"RecContentType=text/html",
//				"Referer=http://localhost:1080/cgi-bin/nav.pl?in=home",
//				"Snapshot=t2.inf",
//				"Mode=HTML",
//				ITEMDATA,
//				"Name=userSession", "Value={userSession}", ENDITEM,
//				"Name=username", "Value=jojo", ENDITEM,
//				"Name=password", "Value=bean", ENDITEM,
//				"Name=JSFormSubmit", "Value=off", ENDITEM,
//				"Name=login.x", "Value=60", ENDITEM,
//				"Name=login.y", "Value=9", ENDITEM,
//				LAST);		
//			web_set_sockets_option("SSL_VERSION", "AUTO");	

    
    
    lr_end_transaction("HomePage", LR_AUTO);
    
    lr_start_transaction("LogOn");

	    web_submit_data("login.pl",
		    "Action=http://localhost:1080/cgi-bin/login.pl",
		    "Method=POST",
		    "TargetFrame=body",
		    "RecContentType=text/html",
		    "Referer=http://localhost:1080/cgi-bin/nav.pl?in=home",
		    "Snapshot=t2.inf",
		    "Mode=HTML",
		    ITEMDATA,
		    "Name=userSession", "Value={c_session}", ENDITEM,
		    "Name=username", "Value=jojo", ENDITEM,
		    "Name=password", "Value=bean", ENDITEM,
		    "Name=JSFormSubmit", "Value=off", ENDITEM,
		    "Name=login.x", "Value=0", ENDITEM,
		    "Name=login.y", "Value=0", ENDITEM,
		    LAST);

    lr_end_transaction("LogOn", LR_AUTO);
    
    lr_start_transaction("Itineraries");

	    //First, grab the parameter values for
	    //flight id and cgi fields using ord=all
	
	    //<input type="hidden" name="flightID" value="14098-820-JM"  />
	
	    web_reg_save_param("c_flightids",
		    "lb=<input type=\"hidden\" name=\"flightID\" value=\"",
		    "rb=\"  />",
		    "ord=all",
		    LAST);
	
	    //<input type="hidden" name=".cgifields" value="6"  />
	
	    web_reg_save_param("c_cgifields",
		    "lb=<input type=\"hidden\" name=\".cgifields\" value=\"",
		    "rb=\"  />",
		    "ord=all",
		    LAST);
	
	    web_url("Itinerary Button",
		    "URL=http://localhost:1080/cgi-bin/welcome.pl?page=itinerary",
		    "TargetFrame=body",
		    "Resource=0",
		    "RecContentType=text/html",
		    "Referer=http://localhost:1080/cgi-bin/nav.pl?page=menu&in=home",
		    "Snapshot=t3.inf",
		    "Mode=HTML",
		    LAST);

    lr_end_transaction("Itineraries", LR_AUTO);

    //This code can be used if you want to delete
    //from the top of the list x number of itineraries.

    lr_save_string("", "c_buffer");

    for (i=1;i<=2;i++)
    {
        lr_param_sprintf("c_buffer", "%s%d=on&", lr_eval_string("{c_buffer}"), i);
    }

    //This code selects what itinerary to cancel.
    //In this case it is the last one that was just created

    lr_param_sprintf("c_buffer",
	    "%s=on&",
	    lr_eval_string("{c_flightids_count}"));

    //This code builds the values for flight id and cgi fields

    for (i=1;i<=atoi(lr_eval_string("{c_flightids_count}"));i++)
    {
        lr_param_sprintf("c_buffer",
	        "%sflightID=%s&",
	        lr_eval_string("{c_buffer}"),
	        lr_paramarr_idx("c_flightids",
	        i));

        lr_param_sprintf("c_buffer",
	        "%s.cgifields=%s&",
	        lr_eval_string("{c_buffer}"),
	        lr_paramarr_idx("c_cgifields",
	        i));
    }

    //This line adds the suffix to the end of the request
    //and saves it as the c_wcr parameter

    lr_save_string(lr_eval_string("{c_buffer}removeFlights.x=36&removeFlights.y=4"), "c_wcr");

    lr_start_transaction("CancelItinerary");

	    //This is a validation to make sure that
	    //the last flight on the list was canceled
	
//	    lr_save_string(lr_eval_string(lr_eval_string("{c_flightids_{c_flightids_count}}")),
//	    "c_cancelflight");
	     lr_save_string(lr_eval_string("{c_flightids_1}"),
	    	"c_cancelflight");
	
	    web_reg_find("Text={c_cancelflight}", "Fail=Found", LAST);
	
	    //Here is the custome built web_custom_request
	
//	    web_custom_request("itinerary.pl_2",
//		    "URL=http://localhost:1080/cgi-bin/welcome.pl?page=itinerary",
//		    "Method=POST",
//		    "Resource=0",
//		    "RecContentType=text/html",
//		    "Referer=http://localhost:1080/cgi-bin/nav.pl?page=menu&in=home",
//		    "Snapshot=t23.inf",
//		    "Mode=HTTP",
//		    "Body={c_wcr}",
//		    LAST);
	    
	    web_submit_form("itinerary.pl",
	        "Snapshot=t10.inf", 
	        ITEMDATA, 
	        "Name=1", "Value=on", ENDITEM,         
	        "Name=removeFlights.x", "Value=73", ENDITEM, 
	        "Name=removeFlights.y", "Value=15", ENDITEM, 
	        LAST);	

    lr_end_transaction("CancelItinerary", LR_AUTO);

    return 0;

}