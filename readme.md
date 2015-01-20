# urbit tree browser

## building

in `src/js/`:
`watchify -v -t coffeeify -o main.js main.coffee`

in `src/css/`:
`stylus -w main.styl`

then copy into your pier:

- `src/js/main.js` and `src/css/main.css` to `pub/src/tree/`
- `tree/` to `pub/fab/tree/`
- `stub/` to `pub/`