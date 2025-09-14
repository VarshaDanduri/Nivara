@echo off
echo Starting local web server for Nirvara Skin Analysis...
echo.
echo The server will be available at: http://localhost:3000
echo.
echo To test the model loading, visit: http://localhost:3000/test-model.html
echo To use the camera, visit: http://localhost:3000/camera.html
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 3000
