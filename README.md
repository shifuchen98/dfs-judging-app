# Judging App for Dreams for Schools

[Dreams for Schools](https://www.dreamsforschools.org) holds programs like [AppJam+](https://www.dreamsforschools.org/appjam/) which let participating teams build their apps and bring them to special events to demonstrate them to judges. During these events, judges walk around booths to try out the apps built by the teams and then give scores to each team. With the help of this app, it’s made efficient for event holders to gather scores from judges and sum them up in order to determine the winners of the program.

## Dependencies

1. [LeanCloud](https://leancloud.app) for [object storage](https://docs.leancloud.app/leanstorage_guide-js.html), [web hosting](https://docs.leancloud.app/leanengine_webhosting_guide-node.html), and [cloud functions](https://docs.leancloud.app/leanengine_cloudfunction_guide-node.html). Note that while we’re using the Developer Plan of LeanCloud (which is free), the cloud can only handle 30,000 requests per day. However, this is totally sufficient for the purpose of this app.
2. [React](https://reactjs.org) as the front-end framework.
3. [React Router](https://reacttraining.com/react-router/) for crunching multiple views into a single-page app.
4. [Papa Parse](https://www.papaparse.com) for parsing and generating CSV.
5. [xlsx-parse-json](https://github.com/abelalvarez89/xlsx-parse-json) for parsing `.xlsx` files.
6. [Font Awesome](https://fontawesome.com) for icons.

## Setting up Development Environment

### Installing Dependencies

```sh
npm install
```

The app will automatically compile after dependencies are installed.

### Running Locally

```sh
npm run serve
```

Note that this app doesn’t need LeanCloud’s command line interface to run locally.

## Deploying the App

The project is set up so that any commit made to this repository will automatically trigger the latest version on the `master` branch to be deployed to LeanEngine (so it’s safe to do experiments on other branches). See [LeanEngine Web Hosting documentation](https://docs.leancloud.app/leanengine_webhosting_guide-node.html#hash224173211) for how such mechanism is set up, as well as how you can manually deploy the app.
