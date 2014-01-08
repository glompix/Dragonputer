# Roadmap
I'm not really satisfied with "Dragonputer." Really want to come up with a new name. Here
are some project goals:

* Slick, fluid interface. Should work efficiently at the table.
* Target phones and tables, but any HTML5-capable browser is supported.
* Works offline without a lot of grief.
* Cloud backup. Figure out how to support financially.

The work is broken into two phases: Prototyping and Generalization.

## Prototyping
This phase is building a prototype. Get it done quick and cheap. Focus on 4e.

### Defects 
* background opacity slider doesn't work.
* check timestamp before downloading character. hit azure download limits on 12/29!
* textareas don't auto-size on load (only change)
* input isn't auto-focused when initiating new list item

### Definite features
* Rearrange status section
* Rearrange meta section
* multiple characters
  * dropdown in app bar (like google play or analytics)
  * cloud sync on/off option
  * grouped by whether or not they're synced to server
* separate edit/display views for powers
  * hide unused sections
* sample characters
* logging and monitoring, for me~

### Possible Features ##
* Number field up/down popup
* highlight special strings in textareas (i.e. WIS, FORT, 1d8, etc...)
* lock sheet
* optional instant-save/sync (signalr)
* watch facebook friend's character (signalr)
* import that dnd4e format.

## Generalization
This phase makes it easy to build other types of character sheets supporting
different games. Write tests, 
