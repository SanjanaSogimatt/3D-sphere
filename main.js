import * as THREE from 'three'
import "./style.css"
import gsap from "gsap"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
const renderer=new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)

//Scene
const scene=new THREE.Scene()

//create our geometry
const geometry=new THREE.SphereGeometry(3,64,64)//just shape
const material=new THREE.MeshStandardMaterial({//how it looks like
    color:'#00ff83',
    roughness:0.3,
})
const mesh=new THREE.Mesh(geometry,material)//combine both 
scene.add(mesh)
//sizes
const sizes={
    width:window.innerWidth,
    height:window.innerHeight
}

//light
const light=new THREE.PointLight(0xffffff,1,100)
light.position.set(0,10,10)
light.intensity=1.25
scene.add(light)

//camera
const camera=new THREE.PerspectiveCamera(45,sizes.width/sizes.height,0.1,100)//last 2 clipping
camera.position.z=20
scene.add(camera)

const canvas=document.querySelector('.webgl')
const render=new THREE.WebGLRenderer({canvas})
render.setSize(sizes.width,sizes.height)
render.setPixelRatio(2)//increases pixel ration
render.render(scene,camera)

const controls=new OrbitControls(camera,canvas)//adding controls
controls.enableDamping=true
controls.enablePan=false//moving and zooming sphere is turned off
controls.enableZoom=false
controls.autoRotate=true
controls.autoRotateSpeed=7

//resize
window.addEventListener('resize',()=>{
    //console.log(window.innerWidth)
    //update sizes
    sizes.width=window.innerWidth
    sizes.height=window.innerHeight
    //update camera
    camera.aspect=sizes.width/sizes.height
    camera.updateProjectionMatrix()
    render.setSize(sizes.width,sizes.height)
})
const loop=()=>{
    //mesh.position.x+=0.1 -->depends on the frames per sec of pc
    controls.update()//moves a bit even after we leave control
    render.render(scene,camera)
    window.requestAnimationFrame(loop)
}
loop()
//timeline
const t1=gsap.timeline({default:{duration:1}})//animation at the start
t1.fromTo(mesh.scale,{z:0,y:0,x:0},{z:1,y:1,x:1})
t1.fromTo('nav',{y:"-100%"},{y:"0%"})
t1.fromTo(".title",{opacity:0},{opacity:1})

//animation color
let mouseDown=false
let rgb=[12,32,55]
window.addEventListener("mousedown",()=>(mouseDown=true))
window.addEventListener("mouseup",()=>(mouseUp=true))
window.addEventListener('mousemove',(e)=>{
    if(mouseDown){
        rgb=[
            Math.round((e.pageX/sizes.width)*255),
            Math.round((e.pageY/sizes.height)*255),
            150,
        ]
        //console.log(rgb)
        //animate
        let newColor=new THREE.Color(`rgb(${rgb.join(",")})`)
        new THREE.Color(`rgb(0,100,150)`)
        gsap.to(mesh.material.color,{r:newColor.r,g:newColor.g,b:newColor.b})
    }
})