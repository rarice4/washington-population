// void main() {
//    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
   
// }

uniform vec3 bboxMin;
uniform vec3 bboxMax;
  
varying vec2 vUv;

void main() {
    vUv.y = (position.z - bboxMin.z) / (bboxMax.z - bboxMin.z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
