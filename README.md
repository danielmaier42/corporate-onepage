# BERGWERK Template

> Dieses Basis Template ist ein Fork vom Orginal [ZURB Foundation Template](https://github.com/zurb/foundation-zurb-template).
> Aufbauend auf dem Template von ZURB wurden noch weitere Funktionen ergänzt. Primär wurde die Build Konfiguration angepasst.

Das ist das offizielle BERGWERK Template. Es besitzt ein Gulp basierdes Build System mit folgende Features:

- Handlebars HTML templates with Panini
- Sass compilation and prefixing
- JavaScript module bundling with webpack
- Built-in BrowserSync server
- For production builds:
  - CSS compression
  - JavaScript compression
  - Image compression

## Installation

Um das Template zu nutzen benötigst du folgende Dinge installiert:

- NodeJS
- Git

## Usage

### Development

Im Regelfall wird dieses Template als Basis für neue Projekte genutzt. Somit sind folgende Schritte notwendig

```
git clone https://gitlab.bergwerk.ag/bergwerk/foundation-template.git
cd foundation-template
rm -rf .git
npm install
git init
```

Danch bist du mit der Einrichtung des Projektes fertig. 

Um mit der Entwicklung zu starten:

```
// Started default Gulp Tasks
npm start

// Started default Gulp Tasks zusammen mit einen Dev Server 
npm run dev:server
```

### Production

Um die Dateien für den Produktiv Einsatz vorzubereiten (Minify etc.) benutze ein:

```
npm run build
```
