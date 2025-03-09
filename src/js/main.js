import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threejs-canvas') });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0A3069); // Black background
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.outputEncoding = THREE.sRGBEncoding;

const environment = new RoomEnvironment( renderer );
const pmremGenerator = new THREE.PMREMGenerator( renderer );
//scene.background = new THREE.Color( 0xbbbbbb );
scene.environment = pmremGenerator.fromScene( environment ).texture;
environment.dispose();

// Add stars
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 1000; i++) {
    starVertices.push(
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000
    );
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffffff }));
scene.add(stars);

// Load the .glb file
const loader = new GLTFLoader();
let mixer; //to control animations
let model;

loader.load(
    '/model/rocket_ship.glb', // Ensure the path matches your file location
    (gltf) => {
        model = gltf.scene;
        model.position.z = -155;
        model.position.y = -125;
        model.rotation.y = Math.PI / 2;
        model.scale.set(0.5, 0.5, 0.5);
        scene.add(gltf.scene);


        // ✅ Step 2: Create an AnimationMixer
        mixer = new THREE.AnimationMixer(gltf.scene);

        gltf.animations.forEach((clip, index) => {
            console.log(`Animation ${index}: ${clip.name}`);
        });

        // ✅ Step 3: Play the first animation (if exists)
        if (gltf.animations.length > 0) {
            const action = mixer.clipAction(gltf.animations[0]); // Play first animation
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
camera.rotateZ(0.5);

// Set up animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    model.position.y += 0.01;

    // ✅ Step 4: Update animations if mixer exists
    if (mixer) {
        mixer.update(clock.getDelta());
    }
    renderer.render(scene, camera);
}
