# avalon
simple WS app

## gcp stuff

- https://stackoverflow.com/questions/18101642/appengine-limit-the-number-of-instances
- https://cloud.google.com/appengine/docs/standard/python/config/appref

## todo

- host tracks win/loss and veto count

- auto clear + hide, nom + mission votes on "next turn"

- highlight current tab
- diff black box for secret info
- only lets noms vote on mission
- add help page for website usage and rules page for avalon
- when joining, assert current name over existing data
  - add ability to change name in reset menu
- add "deleted" optional timestamp to game
  - if/when receive deleted, show alert, then reset
  - ensure reset puts you at lobby if tab === game
