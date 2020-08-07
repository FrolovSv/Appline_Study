@echo off

set appdir=C:\"Program Files (x86)"\apache-jmeter-5.3\bin\
set FileReport=d:\SusPecT\Documents\Appline_Study\Jmeter\Results\2_HW_report\2_HW_Report.csv
set PathReport=d:\SusPecT\Documents\Appline_Study\Jmeter\Results\4_HW_Report

echo -
echo - dashboard formation based on test "22_HW.jmx" results 
echo -

IF EXIST %FileReport% (
echo FileReport - %FileReport% - is exist. OK

echo -
IF EXIST %PathReport% (
rmdir /s/q %PathReport%
echo Path - %PathReport%  delete.
) ELSE (
echo Path - %PathReport%  don`t exist - OK
)

::TIMEOUT /T 3
cd /d %appdir%

jmeter.bat -g %FileReport% -o %PathReport%
echo Success - dashboard successfully formed
TIMEOUT /T 3


) ELSE (
echo ERROR - file - %FileReport% don`t exist
exit
)
