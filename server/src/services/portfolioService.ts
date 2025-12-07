/**
 * Portfolio Service
 * 
 * Provides access to portfolio data (projects, education, experience).
 * 
 * For MVP: Uses mock data
 * For production: Will fetch from Firestore
 */

interface PortfolioItem {
    id: string;
    type: 'project' | 'education' | 'experience' | 'general';
    title: string;
    content: string;
}

/**
 * Get all portfolio content for embedding
 */
export async function getPortfolioContent(): Promise<PortfolioItem[]> {
    // TODO: Replace with Firestore fetching when Firebase is configured
    return getMockPortfolioContent();
}

/**
 * Mock portfolio content for development
 */
function getMockPortfolioContent(): PortfolioItem[] {
    return [
        // General introduction
        {
            id: 'general-intro',
            type: 'general',
            title: 'About Shashwat',
            content: `Shashwat is a passionate software developer who loves building innovative products. 
        With expertise in full-stack development, AI/ML, and cloud technologies, Shashwat creates 
        applications that make a real impact. He believes in clean code, great user experiences, 
        and continuous learning.`,
        },
        {
            id: 'general-skills',
            type: 'general',
            title: 'Technical Skills',
            content: `Shashwat's technical skills include:
        Frontend: React, TypeScript, Next.js, TailwindCSS, Framer Motion
        Backend: Node.js, Express, Python, FastAPI
        Databases: PostgreSQL, MongoDB, Firebase Firestore
        Cloud: Google Cloud Platform, Firebase, AWS
        AI/ML: Vertex AI, Gemini, TensorFlow, LangChain
        Tools: Git, Docker, Kubernetes, CI/CD`,
        },

        // Projects
        {
            id: 'project-portfolio',
            type: 'project',
            title: 'AI Portfolio',
            content: `The AI Portfolio is an interactive, voice-controlled portfolio website. 
        It features a stunning particle sphere visualization and allows visitors to have 
        natural conversations with an AI representation of Shashwat. Built with React, 
        TypeScript, TailwindCSS for the frontend, and Node.js with Vertex AI for the 
        backend. Implements RAG (Retrieval-Augmented Generation) for accurate responses.`,
        },
        {
            id: 'project-harmonize',
            type: 'project',
            title: 'Harmonize',
            content: `Harmonize is a social platform for matching long-term friends based on 
        life alignment. It features a comprehensive life alignment survey, AI-powered 
        matching algorithm, real-time chat with Socket.io, and a beautiful modern UI. 
        Built with React, Node.js, Express, and PostgreSQL. The matching algorithm 
        considers personality, values, interests, and life goals.`,
        },
        {
            id: 'project-comic-turner',
            type: 'project',
            title: 'AI Comic Turner',
            content: `The AI Comic Turner generates complete comic books from text prompts. 
        It uses Vertex AI Gemini for story generation, script creation, and panel 
        descriptions. Features realistic page-turning animations and an immersive 
        reading experience. Users can generate, edit, and download their comics.`,
        },
        {
            id: 'project-webrtc',
            type: 'project',
            title: 'WebRTC Calling App',
            content: `A real-time video and audio calling application built with WebRTC. 
        Features include echo cancellation, synchronized call timers, and high-quality 
        audio/video. Built with React Native for mobile and Node.js for signaling. 
        Uses Firebase for real-time data synchronization.`,
        },
        {
            id: 'project-wardrobe',
            type: 'project',
            title: 'AI Wardrobe',
            content: `AI Wardrobe is a virtual try-on application using AI. Users upload 
        photos and see how different clothes look on them. Features automatic 
        background removal, AI stylist chat, and wardrobe organization. Built with 
        React, Python, and TensorFlow for image processing.`,
        },
        {
            id: 'project-gesture',
            type: 'project',
            title: 'Gesture-Controlled Particles',
            content: `An interactive 3D particle system controlled by hand gestures. 
        Features dual-hand controls for drawing and manipulating shapes in 3D space. 
        Built with Three.js, MediaPipe for hand tracking, and custom GLSL shaders 
        for particle effects. Users can create, move, and delete 3D objects with gestures.`,
        },

        // Education
        {
            id: 'edu-stanford',
            type: 'education',
            title: 'Stanford University - Masters',
            content: `Shashwat completed his Master of Science in Computer Science from 
        Stanford University, focusing on Artificial Intelligence and Machine Learning. 
        He conducted research on natural language processing and conversational AI 
        systems. Achievements include publishing research at EMNLP, maintaining a 
        3.9 GPA, and serving as a Teaching Assistant for CS229 Machine Learning.`,
        },
        {
            id: 'edu-iit',
            type: 'education',
            title: 'IIT - Bachelor of Technology',
            content: `Shashwat earned his Bachelor of Technology in Computer Science and 
        Engineering from the Indian Institute of Technology. He graduated with 
        First Class Honors and led the Coding Club for 2 years. Achievements include 
        winning the ACM-ICPC Regional Programming Contest and completing a summer 
        internship at Google.`,
        },

        // Experience
        {
            id: 'exp-general',
            type: 'experience',
            title: 'Work Experience',
            content: `Shashwat has experience building production applications at scale. 
        He has worked on frontend development with React and TypeScript, backend 
        systems with Node.js and Python, and cloud infrastructure on GCP and AWS. 
        He has contributed to open-source projects and led technical initiatives 
        at various organizations. His work focuses on creating intuitive user 
        experiences backed by robust engineering.`,
        },
    ];
}

/**
 * Get projects list
 */
export async function getProjects() {
    const content = await getPortfolioContent();
    return content.filter(item => item.type === 'project');
}

/**
 * Get education list
 */
export async function getEducation() {
    const content = await getPortfolioContent();
    return content.filter(item => item.type === 'education');
}

/**
 * Get experience list
 */
export async function getExperience() {
    const content = await getPortfolioContent();
    return content.filter(item => item.type === 'experience');
}
