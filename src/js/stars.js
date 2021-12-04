import * as THREE from "./build/three.module.js"
import gsap from "./gsap/all.js"
import {OrbitControls} from "./OrbitControls.js";

// Basic Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("stars"), // Render on canvas
    alpha: true, // Transparent background
    antialias: true // Sharper rendering
});
renderer.setPixelRatio(devicePixelRatio); // Sharper texture rendering
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Stars
const starMaterial = new THREE.PointsMaterial({
    size: 0.1,
    transparent: true,
    map: new THREE.TextureLoader().load("assets/star.png")
})
const starGeometry = new THREE.BufferGeometry();
function generateStarPositions(starCount) {
    const starPositions = []
    for (let i = 0; i < starCount; i++) {
        let x = (Math.random() - 0.5) * 20;
        let y = (Math.random() - 0.5) * 20;
        let z = (Math.random() - 0.5) * 40;
        starPositions.push(x, y, z);
    }
    return new THREE.Float32BufferAttribute(starPositions, 3)
}
starGeometry.setAttribute("position", generateStarPositions(350)) // numStars, dimensions)
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Debugging tools
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);
// const controls = new OrbitControls(camera, renderer.domElement);

// Detecting mouse move
var mouseX = 0;
var mouseY = 0;
document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
})

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
    // Mouse Move animation
    gsap.to(stars.rotation, {
        y: mouseX * 0.0001,
        x: mouseY * 0.0001,
        duration: 2
    })
	renderer.render(scene, camera);
}
animate();

// Responsiveness
addEventListener('resize', () =>
{
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
})