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
//Lighting
const light = new THREE.DirectionalLight(0xffffff,3);
light.position.set(-100,50,400);
// enabling casting shadows
// light.castShadow = true;
// light.shadow.mapSize.x = 8188;
// light.shadow.mapSize.y = 8188;
// light.shadow.camera.left = -60;
// light.shadow.camera.right = 60;
// light.shadow.camera.top = 30;
// light.shadow.camera.bottom = -30;
// light.shadow.camera.near = 30;
// light.shadow.camera.far = 30;
//light.shadow.bias = -.00006;
console.log("LIGHT", light)

// create fixed lighting position
var lightHolder = new THREE.Group();
lightHolder.add(light);
scene.add(lightHolder);
//scene.add(light)

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
camera.position.set(7.300680296968951,68.484720409821, 49.211063761838375)
scene.add(camera)


//renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas,antialias: true});
renderer.setSize(sizes.width,sizes.height);
renderer.setPixelRatio(2);
//TODO: fix shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//renderer.shadowMap.enabled = true;

// Controls
const controls = new OrbitControls(camera, canvas);
//controls.enableDamping = true;
controls.enablePan = true;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.2;


/// material loader
const gltfLoader = new GLTFLoader();
var geometry;
var mapModel;
var texture;

gltfLoader.load('models/wash-decimated.glb', function ( obj ) {
console.log("geometry", obj.scene.children[0].geometry)
console.log("objOuter", obj)
geometry = obj.scene.children[0].geometry //geometry of map model
mapModel = obj.scene.children[0];
var plane = obj.scene.children[1];

console.log("mapModel",mapModel)
//set shadows
mapModel.castShadow = true;
mapModel.receiveShadow = true;
plane.receiveShadow = true;
plane.castShadow = true;

var uniforms = {
  bboxMin: {
    value: geometry.boundingBox.min
  },
  bboxMax: {
    value: geometry.boundingBox.max
  }
}

//create color gradient through vertex and fragment
texture = new THREE.MeshPhongMaterial({
    // uniforms: uniforms,
    // vertexShader: vertexShader,
    // fragmentShader: fragmentShader,
    //color: "white",
    light: true,
    onBeforeCompile: function (myMaterial) {
      console.log("shader", myMaterial)
      
    }
});

//texture.needsUpdate = true; // is necesarry?


//   Set color gradient on map object  
   mapModel.traverse(function(node) {
     if (node.isMesh) {
        console.log("material node", node)
       //node.material = texture;  /// if this is commented out shadows work but custom shader is not applied. 
     }
   });
   
//     var num = 0
//    obj.scene.traverse(function (child) {
//     num+=1
//         console.log("CHILD", child)
//     if (typeof child.castShadow !== 'undefined') {
//       console.log("num",num)
//         child.castShadow = true
//         child.receiveShadow = true
//     }
// })


  //var mesh  = new THREE.Mesh(geometry, texture);
  //var mesh2 = new THREE.Mesh(plane.geometry, texture);
  scene.add( obj.scene);

});


 //render whole scene after mesh texture is loaded

 renderer.render(scene, camera);
 const loop = () => {
     
     controls.update(); //creates rotation
     renderer.render(scene, camera)
     // console.log("loopyyyyy")
     // console.log( "LOG position",controls.object.position )
     lightHolder.quaternion.copy(camera.quaternion);
     window.requestAnimationFrame(loop)
 }
 loop();

