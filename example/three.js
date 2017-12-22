global.THREE = require('three');

const createPlainMaterial = require('./materials/createPlainMaterial');
const material = createPlainMaterial();

const renderer = new THREE.WebGLRenderer({ antialias: true });
document.body.style.margin = '0';
document.body.appendChild(renderer.domElement);
renderer.setSize(256, 256);
renderer.setPixelRatio(window.devicePixelRatio);

const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
camera.position.set(2, 2, -2);
camera.lookAt(new THREE.Vector3());
camera.updateProjectionMatrix();

const scene = new THREE.Scene();
const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64), material);
scene.add(mesh);

window.requestAnimationFrame(render);

function render (time) {
  window.requestAnimationFrame(render);
  mesh.rotation.y += 0.01;
  mesh.material.uniforms.time.value = time / 1000;
  renderer.render(scene, camera);
}
