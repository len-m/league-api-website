# league-api-website

league-api-website is a ReactJS website that implements the league of legends api

## Installation

HTTPS clone:
```bash
git clone https://github.com/len-m/league-api-website.git
```
SSH clone:
```
git clone git@github.com:len-m/league-api-website.git
```

Installing Nodejs
Manual installation: [Nodejs](https://nodejs.org/en/download/)

Installing required nodejs packages:
```bash
npm i react-router-dom express axios cors body-parser encodeurl dotenv memory-cache node-fetch nodemon concurrently
```

By default the backend server cannot fetch information from the Riot-Api due to the api requiring a key. In order for fetching information to work a file named `.env` needs to be created in the root directory. The port on which the server starts on is also defined here. The `.env` file should look like this:
```bash
RIOT_API_KEY=<insert riot api key here>
PORT=3001 
```

A Riot-Api key can be created [here](https://developer.riotgames.com/)

## Usage

To run the website, execute the following command in the root directory:
```bash
npm run dev
```
To run only the frontend execute:
```bash
npm run client
```
To run only the backend execute:
````bash
npm run server
```

## TODO

- create a searchbar to find players
- finish the matchhistory

## License
[MIT](https://choosealicense.com/licenses/mit/)
