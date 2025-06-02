import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'
import { Sky } from 'three/addons/objects/Sky.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#fff', 
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        toonMaterial.color.set(parameters.materialColor)
        glassMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Sky
 */
const sky = new Sky()
sky.scale.set(100, 100, 100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 2
sky.material.uniforms['rayleigh'].value = 5
sky.material.uniforms['mieCoefficient'].value = 0.4
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768, 
    isTablet: window.innerWidth < 1000
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.isMobile = window.innerWidth < 768
    sizes.isTablet = window.innerWidth < 1000

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    setViewportHeightUnit()
})

function setViewportHeightUnit() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Objects
*/
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load("/gradients/5.jpg")
const sbtTexture = textureLoader.load('/logos/sbt-310x310.png');
sbtTexture.colorSpace = THREE.SRGBColorSpace
const camiTexture = textureLoader.load('/logos/cami-app.jpg')
camiTexture.colorSpace = THREE.SRGBColorSpace
const tprotTexture = textureLoader.load('/logos/tprototype.jpeg')
tprotTexture.colorSpace = THREE.SRGBColorSpace

gradientTexture.colorSpace = THREE.SRGBColorSpace
gradientTexture.magFilter = THREE.NearestFilter

// Toon Material
const toonMaterial = new THREE.MeshToonMaterial({ 
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

// Glass Material
const glassMaterial = new THREE.MeshPhysicalMaterial()
glassMaterial.metalness = 0
glassMaterial.roughness = 0
glassMaterial.transmission = 1
glassMaterial.ior = 3.1629
glassMaterial.thickness = 0

if (!window.location.href.includes("testing")) {
    gui.hide()
}

// Icons Materials
const sbtMaterial = new THREE.MeshBasicMaterial({
    map: sbtTexture,
    transparent: true,
});
const camiMaterial = new THREE.MeshBasicMaterial({
    map: camiTexture,
    transparent: true,
    color: 0xffffff
});
const tProtMaterial = new THREE.MeshBasicMaterial({
    map: tprotTexture,
    transparent: true,
    color: 0xffffff
});

// Meshes / Models / Geometries
const objectsDistance = 4

const mesh1 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(12, 2.33, 37, 6, 5, 6),
    glassMaterial
)

const mesh2 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(7.62, 2.1, 28, 5, 6, 5),
    toonMaterial
)
mesh2.material.color.set(parameters.materialColor)

// Fox
const gltfLoader = new GLTFLoader()
let mixer = null
let fox = gltfLoader.load(
    '/models/Fox/glTF/Fox.gltf',
    (gltf) => {
        mixer = new THREE.AnimationMixer(gltf.scene)
        const aciton = mixer.clipAction(gltf.animations[1])

        aciton.play()
        if (sizes.isMobile) {
            gltf.scene.scale.set(0.01, 0.01, 0.01)
            gltf.scene.position.set(0, (- objectsDistance * 2) + 0.2, 0)
        }
        else {
            gltf.scene.scale.set(0.02, 0.02, 0.02)
            gltf.scene.position.set(0, (- objectsDistance * 2) + 0.2, 0)
        }
        gltf.scene.rotation.set(0, Math.PI / 2, 0)
        scene.add(gltf.scene)
    }
)

// Sbt
const sbtBox = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3), 
    sbtMaterial
)

// Cami APP
const camiBox = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3), 
    camiMaterial
)

// TPrototype
const tProtBox = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3), 
    tProtMaterial
)

// Mesh Scaling
if (sizes.isMobile) {
    mesh1.scale.set(0.03, 0.03, 0.03)
    mesh2.scale.set(0.05, 0.05, 0.05)
    sbtBox.scale.set(0.15, 0.15, 0.15)
    camiBox.scale.set(0.15, 0.15, 0.15)
    tProtBox.scale.set(0.15, 0.15, 0.15)
}
else {
    mesh1.scale.set(0.08, 0.08, 0.08)
    mesh2.scale.set(0.1, 0.1, 0.1)
    sbtBox.scale.set(0.4, 0.4, 0.4)
    camiBox.scale.set(0.4, 0.4, 0.4)
    tProtBox.scale.set(0.4, 0.4, 0.4)
}

// Mesh Positioning
mesh1.position.y = sizes.isMobile ? - objectsDistance * 0 - 1.3 : - objectsDistance * 0
mesh2.position.y = sizes.isMobile ? - objectsDistance * 1 - 1.4 : - objectsDistance * 1
sbtBox.position.y = sizes.isMobile ? - objectsDistance * 3 + 1.5 : - objectsDistance * 3
camiBox.position.y = sizes.isMobile ? - objectsDistance * 4 + 1.5 : - objectsDistance * 4
tProtBox.position.y = sizes.isMobile ? - objectsDistance * 5 + 1.5: - objectsDistance * 5

mesh1.position.x = sizes.isMobile ? 0 : 2
mesh2.position.x = sizes.isMobile ? 0 : -2
sbtBox.position.x = sizes.isMobile ? 0 : -2
camiBox.position.x = sizes.isMobile ? 0 : -2
tProtBox.position.x = sizes.isMobile ? 0 : -2


const sectionMeshes = [ mesh1, mesh2, fox, sbtBox, camiBox, tProtBox]

// Fixed top and bottom example:
// mesh1.position.y = 2
// mesh1.scale.set(0.1, 0.1, 0.1)


// mesh2.position.y = -2
// mesh2.scale.set(0.1, 0.1, 0.1)

scene.add(mesh1, mesh2, sbtBox, camiBox, tProtBox)


/**
 * Particles
 */
// Texture
const particleTexture = textureLoader.load('./particles/9.png')

// Geometry
const particlesCount = 300
const positions = new Float32Array(particlesCount * 3)
for (let i = 0; i < particlesCount; i ++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Particles Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor, 
    sizeAttenuation: true, 
    size: 0.1,
    transparent: true,
    alphaTest: 0.001,
    depthTest: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: false,
    alphaMap: particleTexture,
})
// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#fff", 1)
// const helper = new THREE.DirectionalLightHelper(directionalLight)
// scene.add(helper)
directionalLight.position.set(2, 2, 0)
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight("white", 1)
scene.add(ambientLight)


/**
 * Camera
 */

// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0
window.addEventListener('scroll', () => {
    scrollY = window.scrollY

    const newSection = Math.round(scrollY / sizes.height)

    if (newSection != currentSection) {
        currentSection = newSection
        // Fox element not affected
        try {
            gsap.to(
                sectionMeshes[currentSection].rotation, 
                {
                    duration: 1.5, 
                    ease: 'power2.inOut', 
                    x: '+=6', 
                    y: '+=3',
                    z: '+=1.5'
                }
            )
        }
        catch {}

    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
let sbtPaneRotation = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate Camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 4 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 4 * deltaTime

    // Animate meshes 
    for (let i = 0; i < sectionMeshes.length; i++) {
        try {
            sectionMeshes[i].rotation.x += deltaTime * 0.1
            sectionMeshes[i].rotation.y += deltaTime * 0.2
        }
        catch { continue }
    }

    if (mixer != null) {
        mixer.update(deltaTime)
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()