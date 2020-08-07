@echo off

set appdir=C:\"Program Files (x86)"\apache-jmeter-5.3\bin\
set filetest=d:\SusPecT\Documents\Appline_Study\Jmeter\2_HW_2.jmx
set fileLog=d:\SusPecT\Documents\Appline_Study\Jmeter\Results\3_HW_report\3_HW_Result.csv
set htmlRep=d:\SusPecT\Documents\Appline_Study\Jmeter\Results\3_HW_report\HTML_Report



echo -
echo Check if exist file and path to the work derectory
echo -

IF EXIST %fileLog% (
del %fileLog%
echo File - %fileLog% delet.
) ELSE (
echo File - %fileLog% don`t exist - OK
)

echo -
IF EXIST %htmlRep% (
rmdir /s/q %htmlRep%
echo Path - %htmlRep%  delete.
) ELSE (
echo Path - %htmlRep%  don`t exist - OK
)

::echo Run ServerAgent 
::cd /d "c:\Program Files (x86)\Monitoring\ServerAgent-2.2.3\"
::start startAgent.bat
::start DontShowBat.vbs


::TIMEOUT /T 3
cd /d %appdir%

jmeter.bat -n -t %filetest% -l %fileLog% -e -o %htmlRep%
TIMEOUT /T 50