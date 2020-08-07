@echo off

set appdir=C:\"Program Files (x86)"\apache-jmeter-5.3\bin\
set FileReport=d:\SusPecT\Documents\Appline_Study\Jmeter\Results\2_HW_report\2_HW_Report1.csv
set PathReport=d:\SusPecT\Documents\Appline_Study\Jmeter\Results\4_HW_Report

echo -
echo Check if exist file and path to the work derectory
echo -

IF EXIST %FileReport% (
echo File - %FileReport% exist

::TIMEOUT /T 3
cd /d %appdir%

jmeter.bat -g %FileReport% -o %PathReport%
TIMEOUT /T 50

) ELSE (
echo ERROR - file - %FileReport% don`t exist
exit
)
