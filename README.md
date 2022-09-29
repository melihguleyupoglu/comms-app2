## WebRTC APP
This project's goal is provide a communication between two browser tabs.
### Signaling Server
In this project Asterisk was used for signaling the requests between peers. Also signaling library JsSIP was used in this project too.

### Asterisk Installation
Run the below code on terminal for installation of Asterisk.
```
wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-18-current.tar.gz 
```
```
tar -zxvf asterisk-18-current.tar.gz
```
``` 
cd asterisk-18.14
```
```
sudo ./contrib/scripts/get_mp3_source.sh
```
```
sudo contrib/scripts/install_prereq install
```
```
./configure --libdir=/usr/lib64 --with-jansson-bundled
```
```
make && sudo make install
```
```
sudo make samples
```
```
sudo make config
```
Finally you can start the Asterisk with ``` sudo asterisk -cvvv ```

You can edit the config files according to my config files above.
### Development Server
Run ``` ng serve ``` for a dev server. Navigate to ``` https://localhost:4200/ ```. The app wil automatically reload if you change any of the source files.

### Issues
App is running fine on webRTC-softphone, softphone-softphone communication but when I try to make a webRTC-webRTC communication, receiver side cannot see the invite request on signaling server. I am doing it with two different Angular apps running on different local host addresses.

### Build
Run ``` ng build ``` to build the project. The build artifacts will be stored in the ``` dist/ ``` directory. Use the ``` --prod ``` flag for a production build
