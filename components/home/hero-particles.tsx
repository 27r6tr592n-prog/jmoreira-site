"use client"

import { useEffect, useRef } from "react"
import {
  BufferAttribute,
  BufferGeometry,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three"

// Faíscas subindo devagar atrás do herói (decorativo). Toda a animação roda
// no shader (uTime); a CPU só atualiza 2 uniforms por quadro.
// Carregado sob demanda (next/dynamic, ssr: false) só no desktop com movimento.

const COUNT = 520
const BOX = { x: 16, y: 10, z: 6 }
// brand, sky, cta (âmbar) em RGB 0–1, com mais azul que âmbar
const PALETTE = [
  [0.043, 0.388, 0.839],
  [0.22, 0.741, 0.973],
  [0.043, 0.388, 0.839],
  [0.961, 0.62, 0.043],
]

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute vec3 aSeed;   // x: velocidade, y: fase, z: tamanho
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float h = ${BOX.y.toFixed(1)};
    p.y = mod(p.y + uTime * aSeed.x + h * 0.5, h) - h * 0.5;
    p.x += sin(uTime * 0.35 + aSeed.y) * 0.35;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSeed.z * uPixelRatio * (9.0 / -mv.z);
    // some perto das bordas de cima/baixo para não "estourar" na tela
    vAlpha = smoothstep(h * 0.5, h * 0.3, abs(p.y)) * (0.35 + 0.45 * fract(aSeed.y));
    vColor = aColor;
  }
`

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`

export default function HeroParticles() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const host = canvas?.parentElement
    if (!canvas || !host) return

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" })
    } catch {
      return // sem WebGL: o herói segue com a aurora em CSS
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    renderer.setPixelRatio(dpr)

    const scene = new Scene()
    const camera = new PerspectiveCamera(55, 1, 0.1, 50)
    camera.position.z = 9

    const pos = new Float32Array(COUNT * 3)
    const seed = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * BOX.x
      pos[i * 3 + 1] = (Math.random() - 0.5) * BOX.y
      pos[i * 3 + 2] = (Math.random() - 0.5) * BOX.z
      seed[i * 3] = 0.15 + Math.random() * 0.35
      seed[i * 3 + 1] = Math.random() * Math.PI * 2
      seed[i * 3 + 2] = 1.5 + Math.random() * 3.5
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      col.set(c, i * 3)
    }
    const geometry = new BufferGeometry()
    geometry.setAttribute("position", new BufferAttribute(pos, 3))
    geometry.setAttribute("aSeed", new BufferAttribute(seed, 3))
    geometry.setAttribute("aColor", new BufferAttribute(col, 3))

    const material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: dpr } },
      transparent: true,
      depthWrite: false,
      blending: NormalBlending,
    })
    const points = new Points(geometry, material)
    scene.add(points)

    const resize = () => {
      const { width, height } = host.getBoundingClientRect()
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    // Leve inclinação da cena seguindo o mouse (suavizada)
    const target = { x: 0, y: 0 }
    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 0.25
      target.y = (e.clientY / window.innerHeight - 0.5) * 0.15
    }
    window.addEventListener("pointermove", onPointer, { passive: true })

    let frame = 0
    let last = performance.now()
    let time = 0
    let visible = true
    let first = true
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      time += dt
      material.uniforms.uTime.value = time
      // Amortecimento exponencial: mesma suavidade a 60 ou 120 Hz
      const k = 1 - Math.exp(-dt * 2.5)
      points.rotation.y += (target.x - points.rotation.y) * k
      points.rotation.x += (target.y - points.rotation.x) * k
      renderer.render(scene, camera)
      if (first) {
        first = false
        canvas.dataset.ready = ""
      }
      frame = requestAnimationFrame(loop)
    }
    const start = () => {
      if (frame || !visible || document.hidden) return
      last = performance.now()
      frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    // Pausa quando a aba perde o foco ou o herói sai da tela
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVisibility)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(host)
    start()

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("pointermove", onPointer)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full opacity-0 transition-opacity duration-500 data-ready:opacity-100"
    />
  )
}
