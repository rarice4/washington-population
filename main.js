// Option 1: Import the entire three.js core library.
import * as THREE from 'three';
import { Camera } from 'three';
//import "./style.css"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { MathUtils } from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import vertexShader from "/shaders/vertex.glsl"
import fragmentShader from "/shaders/fragment.glsl"

console.log("THREE", THREE)
const loader = new THREE.TextureLoader;
    loader.setCrossOrigin( "" );

const scene = new THREE.Scene();
scene.background = new THREE.Color("white")

//Lighting
const light = new THREE.DirectionalLight(0xffffff,3);
light.position.set(-100,50,400);
// enabling casting shadows
 light.castShadow = true;
// light.shadow.mapSize.x = 8188;
// light.shadow.mapSize.y = 8188;
light.shadow.camera.left = -60;
light.shadow.camera.right = 60;
light.shadow.camera.top = 30;
light.shadow.camera.bottom = -30;
light.shadow.camera.near = 30;
light.shadow.camera.far = 30;
//light.shadow.bias = -.00006;
console.log("LIGHT", light)

// create fixed lighting position
var lightHolder = new THREE.Group();
lightHolder.add(light);
scene.add(lightHolder);

// var shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera);
// shadowCameraHelper.visible = true;
// scene.add(shadowCameraHelper)

// Window Size 
var sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


//Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    //resize camera aspect ratio
    camera.aspect = sizes.width / sizes.height;
    //rerender scene on change
    renderer.setSize(sizes.width, sizes.height);
        camera.updateProjectionMatrix();
        window.requestAnimationFrame(() =>{renderer.render(scene, camera)})

})

//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height)

// set intial camera position based on window width to keep object in view
function setCameraPosition (){
  console.log("screen width", sizes.width)
  if (sizes.width >= 972){
    camera.position.set(4.080558939697067, 42.17579001788252, 63.610911046931726)
  }else{
    camera.position.set( 9.759293189024097, 100.86998039876246, 152.1354157854739)
  }
}

scene.add(camera)


//renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas,antialias: true});
renderer.setSize(sizes.width,sizes.height);
renderer.setPixelRatio(2);
//TODO: fix shadows
//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//renderer.shadowMap.enabled = true;

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
//controls.enablePan = true;
controls.screenSpacePanning = false;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.2;
controls.maxPolarAngle = Math.PI / 2.1;
controls.listenToKeyEvents( window );


//loading manager for loading screen
const spinner = document.getElementById("spinner");
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = function(url, item, total){
  console.log(`started loading ${url}`)
}
loadingManager.onProgress = function(url, loaded, total){
  console.log(`ON PROG items loaded ${loaded}`)
}
loadingManager.onLoad = function(url, loaded, total){
  console.log("Load complete")
  spinner.style.display = "none";
  setCameraPosition();
 
}
/// material loader
const gltfLoader = new GLTFLoader(loadingManager);

gltfLoader.load('models/wash-decimated.glb', function ( obj ) {
  //console.log("Outer Object", obj)
  var geometry = obj.scene.children[0].geometry //geometry of map model
  var mapModel = obj.scene.children[0];
  var plane = obj.scene.children[1];

  mapModel.position.x = -7;

  scene.add( obj.scene);

});


 //render whole scene after mesh texture is loaded

 renderer.render(scene, camera);
 const loop = () => {
     
     controls.update(); //creates rotation
     renderer.render(scene, camera)
     //console.log( "LOG Camera position",controls.object.position )
     lightHolder.quaternion.copy(camera.quaternion);
     window.requestAnimationFrame(loop)
 }
 loop();

