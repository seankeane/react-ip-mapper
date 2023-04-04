# React IP Mapper
## Overview
Programs like Wireshark are used to log network activity and can export logs showing the source and destination IP associated with requests on a Network. Similarly, many SFTP servers have inbuilt logging that records the IP address associated with connections.

IP Mapper allows users to select a .csv file from their local machine with data about network traffic. IP Mapped then request location information about IP addresses on the input file from <a href="https://apilayer.com/marketplace/ip_to_location-api" target="_blank">APILayer's IP to Location API</a> and generates a map showing the physical location of each source and destination IP. IP Mapper allow shows this information in table form.

## Pre-requisites
- A Google Maps API Key is required. See <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank">Use API Keys</a> for more information.
- The APILayer IP to Location API is used to retrieve location information for IPs. See <a href="https://apilayer.com/marketplace/ip_to_location-api" target="_blank">APILayer Info</a> for more information.

## Setup
Clone this repository.

This app uses `dotenv-webpack` module to load authentication keys. Create a `.env` file within root directory of project with the following variables:
```
REACT_APP_GOOGLE_MAP_API_KEY="<Insert your Google Maps API Key here>"
REACT_APP_APILAYER_KEY="<Insert your APILayer API Key here>"
```

Open project directory in terminal and run the following:
```bash
npm install

npm start
```
This will run the app on `http://localhost:3000`.

## Walkthrough

When the app launches you will see a screen with a `Browse Files` input allowing the user to select a .csv file from their local machine.

<img src="screenshots/file_upload.png" alt="file_upload" width="100%"/>

See `test_ip.csv` for example of how .csv should contain. Columns `"DestinationIP"` and `"SourceIP"` are required. All other headers/columns in the file will be ignored.

Once you select your .csv file, the app will render a Google Map showing the mapped Source and Destination IP address. You can click on the markers to see details about a specific location and all data is displayed in a table under the map.

<img src="screenshots/ip_map.png" alt="ip_map" width="100%"/> 



 