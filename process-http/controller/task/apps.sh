#!/bin/sh
board_name=`cat /tmp/sysinfo/board_name`
if [ $board_name == "zc9525" ] || [ $board_name == "zc9526" ] || [ $board_name == "zc9527" ] || [ $board_name == "zc9525a" ] || [ $board_name == "kt9761" ] || [ $board_name == "kt9762" || [ $board_name == "kt8761sk" ]
then
curl -o /tmp/apps_name_ramips_24kec.ipk https://api.rom.kunteng.org.cn:443/packages/apps_name_ramips_24kec.ipk --insecure || return 1
opkg install /tmp/apps_name_ramips_24kec.ipk || return 1
elif [ $board_name == "kt9661" ] || [ $board_name == "kt9671" ] || [ $board_name == "kt9672" ] || [ $board_name == "kt9661w" ]
then
curl -o /tmp/apps_name_ar71xx.ipk https://api.rom.kunteng.org.cn:443/packages/apps_name_ar71xx.ipk --insecure || return 1
opkg install /tmp/apps_name_ar71xx.ipk || return 1
elif [ $board_name == "kt9962" ]
then
curl -o /tmp/apps_name_ar71xx.ipk https://api.rom.kunteng.org.cn:443/packages/apps_name_ramips_1004kc.ipk --insecure || return 1
opkg install /tmp/apps_name_ramips_1004kc.ipk || return 1
elif [ $board_name == "R7800" ]
then
curl -o /tmp/apps_name_arm_cortex-a15_neon-vfpv4.ipk https://api.rom.kunteng.org.cn:443/packages/apps_name_arm_cortex-a15_neon-vfpv4.ipk --insecure || return 1
opkg install /tmp/apps_name_arm_cortex-a15_neon-vfpv4.ipk || return 1
else
echo 'fail'
return 1
fi
return 0
