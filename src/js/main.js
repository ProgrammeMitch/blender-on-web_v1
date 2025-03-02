import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Create a scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the .glb file
const loader = new GLTFLoader();
let mixer; //to control animations

loader.load(
    '/model/box.glb', // Ensure the path matches your file location
    (gltf) => {
        scene.add(gltf.scene);


        // ✅ Step 2: Create an AnimationMixer
        mixer = new THREE.AnimationMixer(gltf.scene);

        gltf.animations.forEach((clip, index) => {
            console.log(`Animation ${index}: ${clip.name}`);
        });

        // ✅ Step 3: Play the first animation (if exists)
        if (gltf.animations.length > 0) {
            const action = mixer.clipAction(gltf.animations[1]); // Play first animation
            action.play();
        }

        animate();
    },
    (xhr) => {
        console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
        console.error('Error loading the model', error);
    }
);

// Set up lighting
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

camera.position.set(4, 9, 18);

// Set up animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    // ✅ Step 4: Update animations if mixer exists
    if (mixer) {
        mixer.update(clock.getDelta());
    }
    renderer.render(scene, camera);
}
