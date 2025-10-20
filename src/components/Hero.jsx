import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { gsap } from "gsap"
import { ArrowDown } from "lucide-react"
import { useI18n } from "../i18n.jsx"

export default function Hero() {
  const { t } = useI18n()
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const torusRef = useRef(null)
  const particlesRef = useRef(null)
  const isMouseDownRef = useRef(false)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const namePointsRef = useRef([])
  const astronautRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000)
    camera.position.z = 15

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 2
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const ambientLight = new THREE.AmbientLight(0xffffff, 3)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.2
    controls.maxPolarAngle = Math.PI / 2
    controls.minPolarAngle = Math.PI / 2

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)

    // Handle unknown GLTF extension KHR_materials_pbrSpecularGlossiness by mapping to MeshStandardMaterial
    if (typeof loader.register === 'function') {
      try {
        loader.register((parser) => {
          return {
            name: 'KHR_materials_pbrSpecularGlossiness',
            getMaterialType: () => THREE.MeshStandardMaterial,
            extendParams: () => Promise.resolve(),
          }
        })
      } catch (e) {
        // ignore if not supported
      }
    }

    loader.load('/models/phihanhgia-transformed.glb', (gltf) => {
      const model = gltf.scene
      model.scale.set(1, 1, 1)
      model.position.set(0, 0, 0)
      scene.add(model)
      astronautRef.current = model

      if (gltf.animations && gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model)
        const clip = gltf.animations.find((anim) => anim.name === 'Animation')
        if (clip) {
          const action = mixer.clipAction(clip)
          action.play()
        }
        const animateModel = () => {
          requestAnimationFrame(animateModel)
          if (mixer) mixer.update(0.016)
          renderer.render(scene, camera)
        }
        animateModel()
      }
    })

    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 3000
    const posArray = new Float32Array(particlesCount * 3)
    const originalPositions = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount * 3; i += 3) {
      const radius = 20
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      posArray[i] = radius * Math.sin(phi) * Math.cos(theta)
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      posArray[i + 2] = radius * Math.cos(phi)
      originalPositions[i] = posArray[i]
      originalPositions[i + 1] = posArray[i + 1]
      originalPositions[i + 2] = posArray[i + 2]
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const particlesMaterial = new THREE.PointsMaterial({ size: 0.05, color: new THREE.Color(0xffffff), transparent: true, opacity: 0.8, sizeAttenuation: true })
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)
    particlesRef.current = particlesMesh

    const torusGeometry = new THREE.TorusGeometry(2, 0.2, 16, 100)
    const torusMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true })
    const torus = new THREE.Mesh(torusGeometry, torusMaterial)
    torus.scale.set(3, 3, 3)
    torus.position.set(0, 0, 5)
    scene.add(torus)
    torusRef.current = torus

    const animate = () => {
      requestAnimationFrame(animate)

      if (astronautRef.current && torusRef.current) {
        const astronautPos = astronautRef.current.position
        const torusPos = torusRef.current.position
        const distance = astronautPos.distanceTo(torusPos)
        if (distance < 3) {
          const direction = new THREE.Vector3().subVectors(astronautPos, torusPos).normalize()
          astronautRef.current.position.add(direction.multiplyScalar(0.1))
          astronautRef.current.rotation.x += (Math.random() - 0.5) * 0.1
          astronautRef.current.rotation.y += (Math.random() - 0.5) * 0.1
          astronautRef.current.rotation.z += (Math.random() - 0.5) * 0.1
        }
      }

      if (particlesRef.current && isMouseDownRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array
        if (namePointsRef.current.length > 0) {
          for (let i = 0; i < positions.length; i += 3) {
            const targetIndex = Math.floor((i / 3) % namePointsRef.current.length)
            const targetPoint = namePointsRef.current[targetIndex]
            const particlePosition = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2])
            const direction = targetPoint.clone().sub(particlePosition).normalize()
            positions[i] += direction.x * 0.1 + (Math.random() - 0.5) * 0.01
            positions[i + 1] += direction.y * 0.1 + (Math.random() - 0.5) * 0.01
            positions[i + 2] += direction.z * 0.1 + (Math.random() - 0.5) * 0.01
          }
        } else {
          const mouseX = (mousePositionRef.current.x / window.innerWidth) * 2 - 1
          const mouseY = -(mousePositionRef.current.y / window.innerHeight) * 2 + 1
          const mousePoint = new THREE.Vector3(mouseX * 10, mouseY * 10, 0)
          for (let i = 0; i < positions.length; i += 3) {
            const particlePosition = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2])
            const direction = mousePoint.clone().sub(particlePosition).normalize()
            positions[i] += direction.x * 0.05 + (Math.random() - 0.5) * 0.01
            positions[i + 1] += direction.y * 0.05 + (Math.random() - 0.5) * 0.01
            positions[i + 2] += direction.z * 0.05 + (Math.random() - 0.5) * 0.01
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true
      } else if (particlesRef.current && !isMouseDownRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array
        for (let i = 0; i < positions.length; i++) {
          const diff = originalPositions[i] - positions[i]
          positions[i] += diff * 0.05
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true
      }

      if (astronautRef.current) {
        const time = Date.now() * 0.001
        const orbitRadius = 8
        const orbitSpeed = 0.3
        const verticalAmplitude = 4
        astronautRef.current.position.x = Math.sin(time * orbitSpeed) * orbitRadius
        astronautRef.current.position.y = Math.cos(time * orbitSpeed * 0.5) * verticalAmplitude
        astronautRef.current.position.z = Math.cos(time * orbitSpeed) * orbitRadius
        astronautRef.current.rotation.y = Math.atan2(Math.cos(time * orbitSpeed) * orbitRadius, Math.sin(time * orbitSpeed) * orbitRadius)
      }

      particlesMesh.rotation.x += 0.0002
      particlesMesh.rotation.y += 0.0002
      torus.rotation.x += 0.003
      torus.rotation.y += 0.002
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleMouseMove = (event) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1
      mousePositionRef.current = { x: event.clientX, y: event.clientY }
      gsap.to(particlesMesh.rotation, { x: mouseY * 0.1, y: mouseX * 0.1, duration: 2 })
    }
    const handleMouseDown = () => { isMouseDownRef.current = true }
    const handleMouseUp = () => { isMouseDownRef.current = false }
    const handleDoubleClick = (event) => {
      const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera)
      if (torusRef.current) {
        const intersects = raycaster.intersectObject(torusRef.current)
        if (intersects.length > 0) {
          gsap.to(torusRef.current.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: 'power1.inOut' })
        }
      }
    }
    const handleResize = () => {
      if (!containerRef.current) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('dblclick', handleDoubleClick)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('dblclick', handleDoubleClick)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [])

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      <div ref={containerRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
      <div className="relative h-full flex flex-col justify-center items-center text-center px-4 z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
          <span className="block text-white">{t('hero.hello')} </span>
          <span className="block bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">{t('hero.title')}</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-10">{t('hero.desc')}</p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <a href="#projects" className="px-8 py-3 rounded-full text-white bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 transition-colors shadow-lg shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/60">{t('hero.ctaWork')}</a>
          <a href="#contact" className="px-8 py-3 rounded-full text-white border border-white/30 hover:bg-white/10 backdrop-blur-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/60">{t('hero.ctaContact')}</a>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="text-white" size={32} />
        </div>
      </div>
    </section>
  )
}


