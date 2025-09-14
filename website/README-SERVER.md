# Running the Skin Analysis Website

## Quick Start

1. **Start the local server:**
   - Double-click `start-server.bat` (Windows)
   - Or run: `python -m http.server 8000` in the website directory

2. **Test the model loading:**
   - Open: http://localhost:8000/test-model.html
   - Check if the model loads successfully

3. **Use the camera:**
   - Open: http://localhost:8000/camera.html
   - Allow camera permissions when prompted

## Troubleshooting

### Model Loading Issues
- The model file is now located at `website/model/trainedSkinmodel.tflite`
- Make sure you're accessing the site through the local server (not file://)
- Check the browser console (F12) for detailed error messages

### Camera Issues
- Ensure you grant camera permissions when prompted
- Try refreshing the page if camera doesn't start
- Check that your browser supports getUserMedia API

### Common Errors
- **CORS Error**: You must use a web server, not open the HTML file directly
- **Model Not Found**: Check that `trainedSkinmodel.tflite` exists in the `website/model/` folder
- **TensorFlow Lite Not Loaded**: Check your internet connection for CDN access

## File Structure
```
website/
├── model/
│   └── trainedSkinmodel.tflite  ← Model file
├── camera.html                   ← Main camera page
├── test-model.html              ← Model testing page
├── start-server.bat             ← Windows server starter
└── README-SERVER.md             ← This file
```
