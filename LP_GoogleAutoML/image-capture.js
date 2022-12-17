const { exec } = require('child_process');
const vision = require('@google-cloud/vision');
var fs = require('fs');


var takeStill = function () {

    //calling the raspberrpi with command 
    var child = exec('libcamera-jpeg -n -o ./images/realtime.jpg --shutter 20000 --gain 1 --width 700 --height 500');

    child.stdout.on('data', function (data) {
        console.log('child process exited with ' +
            `code ${data}`);
    });

    child.on('exit', function (code, signal) {
        console.log('Image Capture   ' + Date.now());



        async function setEndpoint() {
            //run google cloud vision component
            // Specifies the location of the api endpoint
            const clientOptions = { apiEndpoint: 'eu-vision.googleapis.com' };

            // Creates a client
            const client = new vision.ImageAnnotatorClient(clientOptions);

            // Performs text detection on the image file
            const [result] = await client.textDetection('./images/Cars1.png');
            const labels = result.textAnnotations;
            console.log('Text:');

            //  labels.forEach(label => console.log(label.description));

            //  console.log(labels);

            var license_number = null;

            labels.forEach(function (a, b) {

                //console.log(a.description);

                if (b == 0) {
                    license_number = a.description;
                }

            });



            var html = "";

            //If no license plate number detected
            if (license_number == null) {
                license_number = "None Detected"
            } else {

                license_number = license_number.split(/\n|\r|\t/g); //check the license plate with matches newline character / carriage return / tab character with global regex

                for (var i = 0; i < license_number.length; i++) {

                    console.log(license_number[i]);

                    //RegEx for metacharacter that matches word character \w
                    //{} quantifier matches any string that contains a sequence 
                    //Regex for metacharacter matches whitespace character \s
                    //Regex for metacharacter matches digits from 0 - 9 \d
                    if (/\w{2,5}\s{1,2}\w{2,5}$/gi.test(license_number[i]) && /\d+/gi.test(license_number[i])) {
                        html += "<mark>" + license_number[i] + "</mark><br>";
                    } else {
                        html += license_number[i] + "<br>";
                    }

                }

            }

            var data = fs.readFileSync('./html/index.html', 'utf-8');

            var newValue = data.replace(/class="license">.*?<.h3>/gi, 'class="license">' + html + '</h3>');

            fs.writeFileSync('./html/index.html', newValue, 'utf-8');

            console.log('readFileSync complete');




            takeStill();




        }
        setEndpoint();
















    });
}


takeStill();



