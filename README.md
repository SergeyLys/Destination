
## Project structure

```
Project root
│
├─── README.md
├─── index.html 
├─── .htaccess
│
└───assets
    │
    ├─── css
    │   ├─── libs 
    │   │   ├─── ( styles for plugins )
    │   │   ├─── framework
    │   │   ├─── _mixins.scss
    │   │   └─── _variables.scss
    │   │
    │   ├─── pages ( contains scss files that describe pages, starts with '_' )
    │   ├─── components ( contains scss files that describe sections, starts with '_' )
    │   ├─── base64-fonts.scss
    │   └─── global.scss
    │
    ├─── fonts
    │
    ├─── js
    │   ├─── modules 
    │   ├─── libs
    │   └─── global.js
    │
    ├─── images
    │   └─── temp 
    │
    ├─── jade
    │   ├─── components
    │   ├─── templates
    │   └─── (non compiled jade files).jade

```
