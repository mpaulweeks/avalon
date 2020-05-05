# avalon

simple fe app built on Firebase

## setup

create a `.env` file with the following credentials for firebase:

```
REACT_APP_apiKey=
REACT_APP_authDomain=
REACT_APP_databaseURL=
REACT_APP_projectId=
REACT_APP_storageBucket=
REACT_APP_messagingSenderId=
REACT_APP_appId=
REACT_APP_measurementId=
```

install node dependencies:

```
npm i
```

## dev

```
npm run start
```

- Add `?d` to URL and refresh for Debug tab + logs
- Please fork and open PRs

## design

The fe app achieves data flow in the following ways:

- `ViewHub` contains SOR for data, passing down to all other components via props
- All localStorage changes go through `STORAGE`, which calls back to `ViewHub`
- All game data changes go through `FIREBASE`, which calls back to `ViewHub`
