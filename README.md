# npm und gulp install:
cd src/
npm install

# gulp tasks:
gulp styles - Baut css und min.css Dateien, basiert auf sass-Modulen unter src/scss, legt die Enddateien unter dist/css ab
gulp watch styles - Startet auf der console einen watch Prozess, jedes Speichern innerhalb src/sass stoßt den styles task an
gulp scripts - Baut js und min.js Dateien, basiert auf js-Modulen unter src/js/modules, legt die Enddaten unter dist/js ab
gulp watch scripts - Startet auf der console einen watch Prozess, jedes Speichern innerhalb der js-Modulen stoßt den scripts task an
gulp watch - Startet auf der console einen watch Prozess für styles und scripts
gulp clean - leer dist Verzeichnis
gilp build - Baut css/js Dateien inkl. min-Version und legt entsprechend unter dist/css und dist/js die Enddateien ab.