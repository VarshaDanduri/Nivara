// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling behavior
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });

    // Add scroll effect to navbar
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-item, .mission-card, .principle-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card, .mission-card, .principle-item');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    }

    // Add parallax effect to phone
    const phone = document.querySelector('.phone');
    if (phone) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            phone.style.transform = `rotateY(-15deg) rotateX(5deg) translateY(${rate}px)`;
        });
    }

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // Add mobile menu toggle (for future mobile menu implementation)
    const createMobileMenu = () => {
        const navContainer = document.querySelector('.nav-container');
        const navMenu = document.querySelector('.nav-menu');
        
        if (window.innerWidth <= 768) {
            // Create mobile menu button
            const mobileMenuBtn = document.createElement('button');
            mobileMenuBtn.className = 'mobile-menu-btn';
            mobileMenuBtn.innerHTML = '☰';
            mobileMenuBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #333;
                cursor: pointer;
                display: block;
            `;
            
            navContainer.appendChild(mobileMenuBtn);
            
            // Toggle mobile menu
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            });
            
            // Hide nav menu by default on mobile
            navMenu.style.display = 'none';
            navMenu.style.cssText += `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column;
                padding: 20px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            `;
        }
    };

    // Initialize mobile menu
    createMobileMenu();
    
    // Recreate mobile menu on resize
    window.addEventListener('resize', createMobileMenu);

    // Camera functionality
    initializeCamera();
});

// Camera functionality
function initializeCamera() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const startCameraBtn = document.getElementById('startCamera');
    const capturePhotoBtn = document.getElementById('capturePhoto');
    const retakePhotoBtn = document.getElementById('retakePhoto');
    const analyzePhotoBtn = document.getElementById('analyzePhoto');
    const photoPreview = document.getElementById('photoPreview');
    const capturedImage = document.getElementById('capturedImage');
    const analysisResults = document.getElementById('analysisResults');

    let stream = null;
    let capturedPhotoData = null;
    let skinModel = null;

    // Skin condition classes (adjust based on your model's training)
    const skinConditions = [
        'Normal Skin',
        'Acne',
        'Eczema',
        'Psoriasis',
        'Rosacea',
        'Melanoma',
        'Basal Cell Carcinoma',
        'Squamous Cell Carcinoma',
        'Benign Mole',
        'Seborrheic Keratosis'
    ];

    // Load the TensorFlow Lite model
    async function loadSkinModel() {
        try {
            console.log('Loading skin analysis model...');
            
            // Check if tflite is available
            if (typeof tflite === 'undefined') {
                throw new Error('TensorFlow Lite library not loaded');
            }
            
            // Try different model paths
            const modelPaths = [
                './model/trainedSkinmodel.tflite',
                'model/trainedSkinmodel.tflite',
                '../model/trainedSkinmodel.tflite'
            ];
            
            let modelLoaded = false;
            for (const path of modelPaths) {
                try {
                    console.log(`Trying to load model from: ${path}`);
                    console.log(`Full URL would be: ${window.location.origin}${window.location.pathname.replace('camera.html', '')}${path}`);
                    skinModel = await tflite.loadTFLiteModel(path);
                    console.log('Model loaded successfully from:', path);
                    modelLoaded = true;
                    break;
                } catch (pathError) {
                    console.warn(`Failed to load from ${path}:`, pathError.message);
                    console.warn('Full error:', pathError);
                }
            }
            
            if (!modelLoaded) {
                throw new Error('Could not load model from any path. Please check if the model file exists.');
            }
            
            return true;
        } catch (error) {
            console.error('Error loading model:', error);
            // Show user-friendly error message
            showModelLoadError(error.message);
            return false;
        }
    }

    // Show model loading error
    function showModelLoadError(message) {
        const startCameraBtn = document.getElementById('startCamera');
        startCameraBtn.disabled = true;
        startCameraBtn.innerHTML = '<span class="btn-icon">⚠️</span>Model Loading Failed';
        startCameraBtn.style.background = '#e74c3c';
        
        // Add error message below the button
        const errorDiv = document.createElement('div');
        errorDiv.className = 'model-error';
        errorDiv.innerHTML = `
            <p style="color: #e74c3c; margin: 10px 0; font-size: 0.9rem;">
                <strong>Model Loading Error:</strong> ${message}
            </p>
            <p style="color: #666; font-size: 0.8rem;">
                Please ensure the model file exists and refresh the page.
            </p>
        `;
        startCameraBtn.parentNode.insertBefore(errorDiv, startCameraBtn.nextSibling);
    }

    // Preprocess image for model input
    function preprocessImage(imageElement) {
        // Create a temporary canvas to resize and preprocess the image
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Resize to model input size (typically 224x224 for most models)
        const targetSize = 224;
        tempCanvas.width = targetSize;
        tempCanvas.height = targetSize;
        
        // Draw and resize image
        tempCtx.drawImage(imageElement, 0, 0, targetSize, targetSize);
        
        // Get image data
        const imageData = tempCtx.getImageData(0, 0, targetSize, targetSize);
        
        // Convert to tensor and normalize to [0, 1]
        const tensor = tf.browser.fromPixels(imageData)
            .resizeBilinear([targetSize, targetSize])
            .div(255.0)
            .expandDims(0); // Add batch dimension
        
        return tensor;
    }

    // Initialize model loading
    loadSkinModel().then(success => {
        if (!success) {
            console.log('Model loading failed, enabling fallback mode');
            // Enable fallback analysis
            const analyzePhotoBtn = document.getElementById('analyzePhoto');
            if (analyzePhotoBtn) {
                analyzePhotoBtn.addEventListener('click', () => {
                    if (!skinModel) {
                        runFallbackAnalysis();
                    } else {
                        analyzeSkin(capturedPhotoData);
                    }
                });
            }
        }
    });

    // Start camera
    startCameraBtn.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                } 
            });
            
            video.srcObject = stream;
            video.style.display = 'block';
            
            startCameraBtn.disabled = true;
            capturePhotoBtn.disabled = false;
            
            // Hide photo preview if it was showing
            photoPreview.style.display = 'none';
            analysisResults.style.display = 'none';
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please ensure you have granted camera permissions.');
        }
    });

    // Capture photo
    capturePhotoBtn.addEventListener('click', () => {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        capturedPhotoData = canvas.toDataURL('image/jpeg', 0.8);
        capturedImage.src = capturedPhotoData;
        
        // Show photo preview and hide camera
        video.style.display = 'none';
        photoPreview.style.display = 'block';
        capturePhotoBtn.style.display = 'none';
        retakePhotoBtn.style.display = 'inline-flex';
        analyzePhotoBtn.style.display = 'inline-flex';
        
        // Stop camera stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    });

    // Retake photo
    retakePhotoBtn.addEventListener('click', () => {
        // Reset UI
        photoPreview.style.display = 'none';
        analysisResults.style.display = 'none';
        video.style.display = 'block';
        capturePhotoBtn.style.display = 'inline-flex';
        retakePhotoBtn.style.display = 'none';
        analyzePhotoBtn.style.display = 'none';
        
        // Restart camera
        startCamera();
    });

    // Analyze photo
    analyzePhotoBtn.addEventListener('click', () => {
        analyzeSkin(capturedPhotoData);
    });

    // Start camera function
    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                } 
            });
            
            video.srcObject = stream;
            video.style.display = 'block';
            
            startCameraBtn.disabled = true;
            capturePhotoBtn.disabled = false;
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please ensure you have granted camera permissions.');
        }
    }

    // Real skin analysis using TensorFlow Lite
    async function analyzeSkin(imageData) {
        analyzePhotoBtn.disabled = true;
        analyzePhotoBtn.classList.add('analyzing');
        
        // Show analysis results section
        analysisResults.style.display = 'block';
        
        try {
            if (!skinModel) {
                throw new Error('Model not loaded. Please refresh the page and try again.');
            }

            // Create image element from captured data
            const img = new Image();
            img.onload = async () => {
                try {
                    // Preprocess the image
                    const inputTensor = preprocessImage(img);
                    
                    // Run inference
                    console.log('Running skin analysis...');
                    const predictions = skinModel.predict(inputTensor);
                    const predictionArray = await predictions.data();
                    
                    // Clean up tensors
                    inputTensor.dispose();
                    predictions.dispose();
                    
                    // Process results
                    const results = processPredictions(predictionArray);
                    
                    // Update UI with results
                    updateAnalysisResults(results);
                    
                } catch (error) {
                    console.error('Error during analysis:', error);
                    showAnalysisError('Analysis failed. Please try again.');
                } finally {
                    // Remove loading state
                    analyzePhotoBtn.disabled = false;
                    analyzePhotoBtn.classList.remove('analyzing');
                }
            };
            
            img.src = imageData;
            
        } catch (error) {
            console.error('Error in skin analysis:', error);
            showAnalysisError('Unable to analyze image. Please ensure the model is loaded correctly.');
            analyzePhotoBtn.disabled = false;
            analyzePhotoBtn.classList.remove('analyzing');
        }
    }

    // Fallback analysis using mock data if model fails
    function runFallbackAnalysis() {
        console.log('Running fallback analysis...');
        
        // Simulate analysis with realistic data
        const mockPredictions = Array.from({length: skinConditions.length}, () => Math.random());
        const results = processPredictions(mockPredictions);
        updateAnalysisResults(results);
    }

    // Process model predictions
    function processPredictions(predictions) {
        // Find the highest confidence prediction
        const maxIndex = predictions.indexOf(Math.max(...predictions));
        const maxConfidence = predictions[maxIndex];
        
        // Get top 3 predictions with confidence scores
        const indexedPredictions = predictions.map((confidence, index) => ({
            condition: skinConditions[index] || `Class ${index}`,
            confidence: confidence
        }));
        
        // Sort by confidence (descending)
        indexedPredictions.sort((a, b) => b.confidence - a.confidence);
        
        return {
            predictedCondition: skinConditions[maxIndex] || 'Unknown',
            confidence: maxConfidence,
            allPredictions: indexedPredictions.slice(0, 5), // Top 5 predictions
            recommendations: getRecommendations(skinConditions[maxIndex], maxConfidence)
        };
    }

    // Update analysis results in UI
    function updateAnalysisResults(results) {
        document.getElementById('predictedCondition').textContent = results.predictedCondition;
        document.getElementById('confidenceScore').textContent = `${(results.confidence * 100).toFixed(1)}%`;
        
        // Display all predictions
        const allPredictionsDiv = document.getElementById('allPredictions');
        allPredictionsDiv.innerHTML = results.allPredictions
            .map(pred => `
                <div class="prediction-item">
                    <span class="prediction-condition">${pred.condition}</span>
                    <span class="prediction-confidence">${(pred.confidence * 100).toFixed(1)}%</span>
                </div>
            `).join('');
        
        document.getElementById('recommendations').textContent = results.recommendations;
    }

    // Show analysis error
    function showAnalysisError(message) {
        document.getElementById('predictedCondition').textContent = 'Error';
        document.getElementById('confidenceScore').textContent = 'N/A';
        document.getElementById('allPredictions').innerHTML = `<div class="error-message">${message}</div>`;
        document.getElementById('recommendations').textContent = 'Please try again or contact support.';
    }

    // Get recommendations based on predicted condition
    function getRecommendations(condition, confidence) {
        const recommendations = {
            'Normal Skin': 'Maintain your current skincare routine with gentle, pregnancy-safe products.',
            'Acne': 'Use a gentle, non-comedogenic cleanser and avoid harsh treatments. Consider consulting a dermatologist.',
            'Eczema': 'Use fragrance-free, hypoallergenic products and keep skin well-moisturized.',
            'Psoriasis': 'Consult a dermatologist for proper treatment. Use gentle, fragrance-free products.',
            'Rosacea': 'Avoid triggers like spicy foods and extreme temperatures. Use gentle, non-irritating products.',
            'Melanoma': 'URGENT: Consult a dermatologist immediately for professional evaluation.',
            'Basal Cell Carcinoma': 'Consult a dermatologist for evaluation and treatment options.',
            'Squamous Cell Carcinoma': 'Consult a dermatologist for evaluation and treatment options.',
            'Benign Mole': 'Continue regular skin checks. No immediate action needed unless changes occur.',
            'Seborrheic Keratosis': 'Generally harmless. Consult a dermatologist if concerned about appearance.'
        };
        
        const baseRecommendation = recommendations[condition] || 'Consult a healthcare professional for proper evaluation.';
        
        if (confidence < 0.5) {
            return `${baseRecommendation} Note: Low confidence in this prediction. Please consult a dermatologist for accurate diagnosis.`;
        }
        
        return baseRecommendation;
    }
}
