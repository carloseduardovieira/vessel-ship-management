# Vessel Ship Management

![Vessel Ship Management](image_url_here)

## Summary

The Vessel Ship Management is a web-based application designed to visualize coordinates of a selected vessel on an interactive map. This project aims to provide a user-friendly interface for following vessels route in various maritime regions.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

To set up the Vessel Ship Management on your local machine, follow these steps:

1. Clone this repository to your local machine using `git clone`.
2. Install the required dependencies by running `npm install`.
3. Obtain an API key from a MAPBOX
4. Create the environment.ts file

   - create a `environment.ts` file in the path: `core/src/lib/environments/` and follow the environment.sample.ts JSON

5. Configure the application with your MAPBOX API key
   **paste the key in the environment file**

6. Run the application using `nx serve` and [access it in your web browser](http://localhost:4200).

## Features

Once installed, users can access the Vessel Ship Managment through their web browser. The main functionalities of the application include:

**Filtering Vessel Routes:** Users can filter and search for specific vessel routes based on their origin and destination

**Interactive Map View:** The application offers an interactive map interface where users can visualize vessel routes overlaid on the map. Users can click on individual routes in a list to view detailed information about the vessel's journey.

**Speed Variation Chart:** The application provides a chart displaying changes in vessel speed over time along the selected route. This feature enables users to analyze the vessel's speed patterns and identify any deviations or anomalies.

## Contributing

Contributions to the Vessel Ship Management project are welcome! If you would like to contribute, please follow these guidelines:

1. Fork the repository and create a new branch for your feature or bug fix.
2. Make your changes, ensuring that code quality and documentation standards are maintained.
3. Test your changes thoroughly to avoid introducing new issues.
4. Submit a pull request with a clear description of your changes and their purpose.

## License

The Vessel Ship Management project is licensed under the [MIT License](LICENSE).
