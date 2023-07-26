// void main(){
//     gl_FragColor = vec4(1,0,0,1);
// }
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
vec4 blue = vec4(1.0/255.0, 100.0/255.0, 156.0/255.0, 1.0);
    vec4 yellow = vec4(198.0/255.0, 154.0/255.0, 0.0, 1.0);
    vec4 lightgreen = vec4(88.0/255.0, 255.0/255.0, 94.0/255.0, 1.0);
    vec4 green = vec4(0.0, 228.0/255.0, 26.0/255.0, 1.0);
    vec4 cyan = vec4(84.0/255.0, 196.0/255.0, 138.0/255.0, 1.0);
  
varying vec2 vUv;
    
void main() {
    float step1 = 0.99999;
    float step2 = 0.995;
    float step3 = 0.955;
    float step4 = 0.402;
    float step5 = 0.114;

    vec4 color = mix(blue, yellow, smoothstep(step1, step2, vUv.y));
    color = mix(color, lightgreen, smoothstep(step2, step3, vUv.y));
    color = mix(color, green, smoothstep(step3, step4, vUv.y));
    color = mix(color, cyan, smoothstep(step4, step5, vUv.y));

    gl_FragColor = color;
    // gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
}