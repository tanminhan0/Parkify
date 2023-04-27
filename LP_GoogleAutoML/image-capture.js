const { exec } = require("child_process");
const vision = require("@google-cloud/vision");
var fs = require("fs");
const fetch = require("node-fetch");

var takeImage = function () {
  //calling the raspberrypi with command
  var child = exec(
    "libcamera-jpeg -n -o ./images/realtime.jpg --shutter 20000 --gain 1 --width 700 --height 500"
  );

  child.stdout.on("data", function (data) {
    console.log("child process exited with " + `code ${data}`);
  });

  child.on("exit", function (code, signal) {
    console.log("Image Capture   " + Date.now());

    const addAPI = async (license) => {
      // Extract the correct license plate number using regular expressions
      const regex = /(\d{2,3}-[A-Z]{1,2}-\d{2,5})/g; // regex for license plate format ###-XX-#####
      const match = regex.exec(license);
      console.log(match); // add this line

      const license_plate = match ? match[0] : null;

      if (license_plate) {
        try {
          const res = await fetch(
            `https://a234-77-75-244-145.ngrok-free.app/addCar`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "69420",
              },
              body: JSON.stringify({
                license_plate: license_plate,
              }),
            }
          );
          const data = await res.json();
          console.log(data);
          console.log("CAR ADDED");
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log("No valid license plate found.");
      }
    };

    async function plateDetection() {
      //run google cloud vision component
      // Specifies the location of the api endpoint
      const clientOptions = { apiEndpoint: "eu-vision.googleapis.com" };

      // Creates a client
      const client = new vision.ImageAnnotatorClient(clientOptions);

      // Performs text detection on the image file
      const [result] = await client.textDetection("./images/realtime.jpg");
      const labels = result.textAnnotations;
      console.log("Text:");

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
      var data = "";
      //If no license plate number detected
      if (license_number == null) {
        license_number = "None Detected";
      } else {
        license_number = license_number.split(/\n|\r|\t/g); //check the license plate with matches newline character / carriage return / tab character with global regex

        for (var i = 0; i < license_number.length; i++) {
          console.log(license_number[i]);

          //RegEx for metacharacter that matches word character \w
          //{} quantifier matches any string that contains a sequence
          //Regex for metacharacter matches whitespace character \s
          //Regex for metacharacter matches digits from 0 - 9 \d
          if (
            /\w{2,5}\s{1,2}\w{2,5}$/gi.test(license_number[i]) &&
            /\d+/gi.test(license_number[i])
          ) {
            html += "<mark>" + license_number[i] + "</mark><br>";
            data += license_number[i];
          } else {
            html += license_number[i] + "<br>";
            data += license_number[i];
          }
        }
        //console.log("TEST " + data);
        addAPI(data);
      }

      var data = fs.readFileSync("./html/index.html", "utf-8");

      var newValue = data.replace(
        /class="license">.*?<.h3>/gi,
        'class="license">' + html + "</h3>"
      );

      fs.writeFileSync("./html/index.html", newValue, "utf-8");

      console.log("readFileSync complete");

      takeImage();
    }
    plateDetection();
  });
};

takeImage();
