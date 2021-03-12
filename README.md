# CoinLimits #
[Link to App on App Store](https://apps.apple.com/us/app/cryptolimit/id1557401004)
[Link to Demo Video on Youtube](https://www.youtube.com/watch?v=Luck4BbAU50)

## Overview ##
This is a mobile app for checking real-time Cryptocurrency data and setting limits on when to buy/sell for saved Cryptocurrencies.

## Screenshots ##
<img src="https://derekvelzy-website-images.s3-us-west-1.amazonaws.com/CLHome.PNG" height="300">
<img src="https://derekvelzy-website-images.s3-us-west-1.amazonaws.com/CLOptions.PNG" height="300">
<img src="https://derekvelzy-website-images.s3-us-west-1.amazonaws.com/CLLimits.PNG" height="300">
<img src="https://derekvelzy-website-images.s3-us-west-1.amazonaws.com/CLSet.PNG" height="300">

## Features ##
#### Authentication ####
- Sign in with email and password or as a guest.
- Signing in as a guest will revoke the capabilities to save and set price limits.

#### Search/Filter ####
- Users can search for and browse through the top 30 most popular Cryptocurrencies.
- Users can filter currencies by popularity or movement.
  - Movement can be filtered by percentage increase for the past hour, 24 hours, 7 days, or 30 days.

#### All Currencies ####
- Data for Cryptocurrencies is updated every 5 mins and connected to the server via Websocket.
- Data included in each item:
  - Popularity
  - Current cost
  - Percentage increase (filtered by movement)
  - Volume
  - Market Cap
  - Circulating Supply
- Users can add currencies to their Saved section by setting upper and lower limits on when to buy or sell.
- Users can edit their limits in their Saved section.

## Tech/framework Used ##
__Built with__
#### Frontend ####
- JavaScript
- React Native
- Redux Toolkit
- Socket.io
- React Spring

#### Backend ####
- AWS ec2 instance
- MongoDB
- Redis
- CoinMarketCap API

## Run the Project Locally ##
From the repo
1. Clone the project locally
2. Run ```npm install``` in the command line
3. Run ```cd ios/ && pod install``` in the command line
3. Run ```npm run ios``` in the command line

--[Derek Velzy's Porfolio](https://www.dvelzyportfolio.com/)
