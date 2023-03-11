
const div = document.querySelector('.threejs');
let mesh;

document.forms[0].addEventListener('change', (e) => {
  mesh.material.color.set(e.target.value);
})

window.addEventListener('resize', onWindowResize);

function onWindowResize() {

  camera.aspect = div.clientWidth / div.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(div.clientWidth, div.clientHeight);

}

const clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, div.clientWidth / div.clientHeight, 0.1, 100);
camera.position.set(3, 0.7, 3);
cameraTarget = new THREE.Vector3(0, 0.4, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(div.clientWidth, div.clientHeight);

div.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

scene.background = new THREE.Color('gray');
scene.fog = new THREE.Fog('gray', 1, 5);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(25, 25, 25);
directionalLight.castShadow = true;

directionalLight.shadow.mapSize.width = 2000; // default
directionalLight.shadow.mapSize.height = 2000; // default
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = - 10;
directionalLight.shadow.camera.left = - 10;
directionalLight.shadow.camera.right = 10;
scene.add(directionalLight);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(4000, 4000),
  new THREE.MeshPhongMaterial({ color: 0x808080, dithering: true })
);
plane.rotation.x = - Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

const loader = new STLLoader();
loader.load('/models/qtip.STL', function (geometry) {

  const material = new THREE.MeshPhongMaterial({ color: 0xAAAAAA, specular: 0x111111, shininess: 200 });
  mesh = new THREE.Mesh(geometry, material);

  let box = new THREE.Box3();
  let size = new THREE.Vector3();

  box.setFromObject(mesh).getSize(size);
  mesh.scale.set(1 / size.y, 1 / size.y, 1 / size.y);

  let center = new THREE.Vector3()
  box.setFromObject(mesh).getCenter(center);

  mesh.position.set(-center.x, 0, -center.z);

  mesh.castShadow = true;

  scene.add(mesh);

});


camera.position.z = 5;

function animate() {

  requestAnimationFrame(animate);

  render();

}

function render() {

  const elapsedTime = clock.getElapsedTime()

  camera.position.x = Math.cos(elapsedTime * 0.5) * 2;
  camera.position.z = Math.sin(elapsedTime * 0.5) * 2;

  camera.lookAt(cameraTarget);

  renderer.render(scene, camera);

}

animate();