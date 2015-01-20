# urbit tree browser

## building

in `src/js/`:
`watchify -v -t coffeeify -o main.js main.coffee`

in `src/css/`:
`stylus -w main.styl`

then copy into your pier:

- `src/js/main.js` and `src/css/main.css` to `main/pub/src/tree/`
- `tree/` to `main/tree/`
- `stub/` to `main/pub/`

## running

accessible at `http://localhost:8444/gen/main/tree`, where `8444` is your pier's http port.
