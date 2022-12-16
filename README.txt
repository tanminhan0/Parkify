PARKIFY 
1. Connect RaspberryPi with PiCamera into PC / Laptop
2. Open up LP_GoogleAutoML code in VSCode or any terminal
3. npm install (for the packages)
4. Remote ssh pi@rasbperrypi.local
5. Password: 12345 (that set to raspberrypi configuration)


sudo su - (To get into root)

# Execute Script
GOOGLE_APPLICATION_CREDENTIALS="/var/www/html/alpr/gcp-key.json" node image-capture.js


