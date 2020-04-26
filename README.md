# avalon

simple fe app built on Firebase

## setup

```
npm i
```

- Firebase credentials are hardcoded because I'm lazy :)
- Same Firebase connection between dev and prod because still lazy

## dev

```
npm run start
```

- Add `#d` to URL and refresh for Debug tab + logs
- Please work on branch and open PR

## design

The fe app achieves data flow in the following ways:

- `ViewHub` contains SOR for data, passing down to all other components via props
- All localStorage changes go through `STORAGE`, which calls back to `ViewHub`
- All game data changes go through `FIREBASE`, which calls back to `ViewHub`
