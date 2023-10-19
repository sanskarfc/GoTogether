# GoTogether

## Contents
- [Setting up the Application](#setting-up-the-application)
- [Bugs Faced](#bugs-faced)
  
## Setting up the Application 
1. Clone the repo.
2. Run `npm install` to install all dependancies. 
3. Run `npx expo start` to start the application. You can follow the on-screen instructions to use the application on your phone.
4. Create a `config.json` file in the root directory and populate it with: `{"API_KEY":"PUT_THE_API_KEY_HERE",}`.
5. Create a `.env` file in gtdatabase directory. Populate it with environment variables needed for connecting to mysql database on planetscale.
6. To run mysql server:
    - `cd gtdatabase`
    - `py server.py`
7. To run server for chat:
    - `cd chat`
    - `py main.py`

## Bugs Faced
These are the bugs we faced during the implementation:
- Date-time picker behaves unexpectedly for Android. similar to [this](https://github.com/react-native-datetimepicker/datetimepicker/issues/54)
- Dependency issues. similar to [this](https://github.com/expo/expo/issues/21739)


- Documentation to read more about [using Clerk with expo.](https://clerk.com/docs/quickstarts/get-started-with-expo)

