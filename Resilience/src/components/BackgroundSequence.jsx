import React, { useRef, useEffect, useState } from 'react';

const BackgroundSequence = ({ scrollProgress }) => {
    const canvasRef = useRef(null);
    const [images, setImages] = useState([]);
    const frameCount = 300; // Based on the 300 images renamed to 000.png - 299.png

    // Preload Images
    useEffect(() => {
        const loadedImages = [];
        let loadedCount = 0;

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            // Format index like 000, 001, 167
            const formatIndex = i.toString().padStart(3, '0');
            img.src = `/farm-swarm/${formatIndex}.png`;

            img.onload = () => {
                loadedCount++;
                if (loadedCount === 1) {
                    // Draw first frame immediately
                    drawFrame(0, loadedImages);
                }
            };
            loadedImages.push(img);
        }
        setImages(loadedImages);
    }, []);

    // Update canvas on scroll
    useEffect(() => {
        if (images.length === 0) return;

        // Convert scrollProgress (0 to 1) to frame index
        const maxIndex = frameCount - 1;
        // adding a slight easing makes it feel grounded but raw progress is also fine
        const frameIndex = Math.min(maxIndex, Math.max(0, Math.floor(scrollProgress * frameCount)));

        // Use requestAnimationFrame for smooth painting
        let animationFrameId;
        const render = () => {
            drawFrame(frameIndex, images);
        };
        animationFrameId = requestAnimationFrame(render);

        return () => cancelAnimationFrame(animationFrameId);
    }, [scrollProgress, images]);

    const drawFrame = (index, imgArray) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const img = imgArray[index];

        if (img && img.complete) {
            // We want to ensure the image covers the canvas (object-fit: cover equivalent)
            const targetRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;

            let drawWidth = canvas.width;
            let drawHeight = canvas.height;
            let offsetX = 0;
            let offsetY = 0;

            if (imgRatio > targetRatio) {
                // Image is wider than canvas
                drawWidth = canvas.height * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
            } else {
                // Image is taller than canvas
                drawHeight = canvas.width / imgRatio;
                offsetY = (canvas.height - drawHeight) / 2;
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
    };

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                // Redraw current frame
                const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.floor(scrollProgress * frameCount)));
                if (images.length > 0) drawFrame(frameIndex, images);
            }
        };

        // Initial size
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [scrollProgress, images]);

    return <canvas ref={canvasRef} className="sequence-canvas" />;
};

export default BackgroundSequence;
