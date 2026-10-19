import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import './style.css'

// 1. Create the scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#d8dce3')

// 2. Create the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.set(0, 1.5, 5)

// 3. Create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace

document.querySelector<HTMLDivElement>('#app')!.appendChild(
  renderer.domElement
)

// 4. Add lighting
const ambientLight = new THREE.HemisphereLight(
  0xffffff,
  0x777788,
  2
)
scene.add(ambientLight)

const sunLight = new THREE.DirectionalLight(0xffffff, 2)
sunLight.position.set(5, 10, 5)
scene.add(sunLight)

// 5. Load your Blender model
const loader = new GLTFLoader()

loader.load(
  `${import.meta.env.BASE_URL}models/my-3d-room-01.glb`,
  (gltf) => {
    scene.add(gltf.scene)
    console.log('Room model loaded successfully!')
  },
  undefined,
  (error) => {
    console.error('Could not load room.glb:', error)
  }
)

// 6. Enable first-person mouse controls
const controls = new PointerLockControls(
  camera,
  renderer.domElement
)

const overlay = document.querySelector<HTMLDivElement>('#overlay')!
const startButton =
  document.querySelector<HTMLButtonElement>('#start-button')!

startButton.addEventListener('click', () => {
  controls.lock()
})

controls.addEventListener('lock', () => {
  overlay.style.display = 'none'
})

controls.addEventListener('unlock', () => {
  overlay.style.display = 'flex'
})

// 7. Track the movement keys
const keys: Record<string, boolean> = {}

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase()

  if (['w', 'a', 's', 'd', 'q', 'e'].includes(key)) {
    event.preventDefault()
    keys[key] = true
  }
})

window.addEventListener('keyup', (event) => {
  keys[event.key.toLowerCase()] = false
})

window.addEventListener('blur', () => {
  Object.keys(keys).forEach((key) => {
    keys[key] = false
  })
})

// 8. Scroll to zoom
renderer.domElement.addEventListener(
  'wheel',
  (event) => {
    event.preventDefault()

    camera.fov = THREE.MathUtils.clamp(
      camera.fov + event.deltaY * 0.03,
      35,
      90
    )

    camera.updateProjectionMatrix()
  },
  { passive: false }
)

// 9. Animate movement smoothly
const clock = new THREE.Clock()
const movementSpeed = 3

function animate() {
  requestAnimationFrame(animate)

  const delta = Math.min(clock.getDelta(), 0.05)

  if (controls.isLocked) {
    if (keys['w']) {
      controls.moveForward(movementSpeed * delta)
    }

    if (keys['s']) {
      controls.moveForward(-movementSpeed * delta)
    }

    if (keys['a']) {
      controls.moveRight(-movementSpeed * delta)
    }

    if (keys['d']) {
      controls.moveRight(movementSpeed * delta)
    }

    if (keys['q']) {
      camera.position.y += movementSpeed * delta
    }

    if (keys['e']) {
      camera.position.y -= movementSpeed * delta
    }
  }

  renderer.render(scene, camera)
}

animate()

// 10. Handle browser resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
})
