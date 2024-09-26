document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');
    const form = document.getElementById('image-form');
    const prompt = document.getElementById('prompt');
    const result = document.getElementById('result');
    const enhanceContainer = document.querySelector('.enhance-container');
    const enhanceBackground = document.querySelector('.enhance-background');

    // Tab functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.getAttribute('data-tab');
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabName) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userPrompt = prompt.value.trim();
        if (!userPrompt) return;

        try {
            result.innerHTML = '<p>Generating image...</p>';
            const image = await generateImage(userPrompt);
            displayImage(image);
        } catch (error) {
            result.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });

    // Image generation function using the proxy server
    async function generateImage(prompt) {
        const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            throw new Error('Failed to generate image');
        }

        const prediction = await response.json();
        return prediction.output[0];
    }

    // Display generated image
    function displayImage(imageUrl) {
        result.innerHTML = `<img src="${imageUrl}" alt="Generated Image">`;
    }

    // Save to Firebase (implement this function)
    function saveToFirebase(prompt, imageUrl) {
        // Implement Firebase saving logic here
        console.log('Saving to Firebase:', { prompt, imageUrl });
    }

    enhanceContainer.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = enhanceContainer.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        enhanceBackground.style.transform = `
          scale(1.05)
          translate(${x * 20}px, ${y * 20}px)
          rotateX(${y * 10}deg)
          rotateY(${-x * 10}deg)
        `;
        enhanceBackground.style.boxShadow = `
          0 ${20 + y * 20}px 50px rgba(0, 0, 0, 0.4)
        `;
        enhanceBackground.querySelector('.enhance-text').style.transform = `
          translateX(-50%)
          translateY(${y * 10}px)
          rotateX(${-y * 10}deg)
          rotateY(${x * 10}deg)
        `;
        enhanceBackground.style.setProperty('--before-opacity', '0');
      });
    
      enhanceContainer.addEventListener('mouseleave', () => {
        enhanceBackground.style.transform = 'scale(1) translate(0, 0) rotateX(0) rotateY(0)';
        enhanceBackground.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        enhanceBackground.querySelector('.enhance-text').style.transform = 'translateX(-50%) translateY(0) rotateX(0) rotateY(0)';
        enhanceBackground.style.setProperty('--before-opacity', '0.3');
      });
});