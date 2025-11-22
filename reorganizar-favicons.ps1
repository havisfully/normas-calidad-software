# Reorganización de favicons: mover todos los archivos de favicon_io a public
#
# 1. Mover los siguientes archivos:
#   - android-chrome-192x192.png
#   - android-chrome-512x512.png
#   - apple-touch-icon.png
#   - favicon-16x16.png
#   - favicon-32x32.png
#   - site.webmanifest
#
# 2. Eliminar la carpeta favicon_io si queda vacía.
# 3. El archivo favicon.ico ya está en public, no moverlo.
#
# 4. El archivo about.txt no es necesario para producción, puedes ignorarlo o eliminarlo.
#
# 5. El .gitignore ya está correcto, no es necesario ignorar ningún favicon ni archivo de public.
#
# Puedes ejecutar estos comandos en PowerShell desde la raíz del proyecto:
#
# Mover archivos:
Move-Item -Path .\public\favicon_io\android-chrome-*.png -Destination .\public
Move-Item -Path .\public\favicon_io\apple-touch-icon.png -Destination .\public
Move-Item -Path .\public\favicon_io\favicon-*.png -Destination .\public
Move-Item -Path .\public\favicon_io\site.webmanifest -Destination .\public
#
# (Opcional) Eliminar carpeta si está vacía:
Remove-Item -Path .\public\favicon_io -Force
#
# (Opcional) Eliminar about.txt si no lo necesitas:
Remove-Item -Path .\public\favicon_io\about.txt -Force

# Después de esto, todos los favicons estarán en public y listos para subir a GitHub.
