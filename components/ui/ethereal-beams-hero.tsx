"use client";

import React from "react"

import { forwardRef, useImperativeHandle, useEffect, useRef, useMemo, type FC, type ReactNode } from "react"
import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera } from "@react-three/drei"
import { degToRad } from "three/src/math/MathUtils.js"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"

// ============================================================================
// BEAMS COMPONENT (3D Background)
// ============================================================================

type UniformValue = THREE.IUniform<unknown> | unknown

interface ExtendMaterialConfig {
  header: string
  vertexHeader?: string
  fragmentHeader?: string
  material?: THREE.MeshPhysicalMaterialParameters & { fog?: boolean }
  uniforms?: Record<string, UniformValue>
  vertex?: Record<string, string>
  fragment?: Record<string, string>
}

type ShaderWithDefines = THREE.ShaderLibShader & {
  defines?: Record<string, string | number | boolean>
}

function extendMaterial<T extends THREE.Material = THREE.Material>(
  BaseMaterial: new (params?: THREE.MaterialParameters) => T,
  cfg: ExtendMaterialConfig,
): THREE.ShaderMaterial {
  const physical = THREE.ShaderLib.physical as ShaderWithDefines
  const { vertexShader: baseVert, fragmentShader: baseFrag, uniforms: baseUniforms } = physical
  const baseDefines = physical.defines ?? {}

  const uniforms: Record<string, THREE.IUniform> = THREE.UniformsUtils.clone(baseUniforms)

  const defaults = new BaseMaterial(cfg.material || {}) as T & {
    color?: THREE.Color
    roughness?: number
    metalness?: number
    envMap?: THREE.Texture
    envMapIntensity?: number
  }

  if (defaults.color) uniforms.diffuse.value = defaults.color
  if ("roughness" in defaults) uniforms.roughness.value = defaults.roughness
  if ("metalness" in defaults) uniforms.metalness.value = defaults.metalness
  if ("envMap" in defaults) uniforms.envMap.value = defaults.envMap
  if ("envMapIntensity" in defaults) uniforms.envMapIntensity.value = defaults.envMapIntensity

  Object.entries(cfg.uniforms ?? {}).forEach(([key, u]) => {
    uniforms[key] =
      u !== null && typeof u === "object" && "value" in u
        ? (u as THREE.IUniform<unknown>)
        : ({ value: u } as THREE.IUniform<unknown>)
  })

  let vert = `${cfg.header}
${cfg.vertexHeader ?? ""}
${baseVert}`
  let frag = `${cfg.header}
${cfg.fragmentHeader ?? ""}
${baseFrag}`

  for (const [inc, code] of Object.entries(cfg.vertex ?? {})) {
    vert = vert.replace(inc, `${inc}
${code}`)
  }

  for (const [inc, code] of Object.entries(cfg.fragment ?? {})) {
    frag = frag.replace(inc, `${inc}
${code}`)
  }

  const mat = new THREE.ShaderMaterial({
    defines: { ...baseDefines },
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    lights: true,
    fog: !!cfg.material?.fog,
  })

  return mat
}

const CanvasWrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <Canvas dpr={[1, 2]} frameloop="always" className="w-full h-full relative">
    {children}
  </Canvas>
)

const hexToNormalizedRGB = (hex: string): [number, number, number] => {
  const clean = hex.replace("#", "")
  const r = Number.parseInt(clean.substring(0, 2), 16)
  const g = Number.parseInt(clean.substring(2, 4), 16)
  const b = Number.parseInt(clean.substring(4, 6), 16)
  return [r / 255, g / 255, b / 255]
}

const noise = `
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
           (c - a)* u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x,Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy,Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy,Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x,Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz = mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz = mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2 * n_xyz;
}
`

interface BeamsProps {
  beamWidth?: number
  beamHeight?: number
  beamNumber?: number
  lightColor?: string
  speed?: number
  noiseIntensity?: number
  scale?: number
  rotation?: number
  backgroundColor?: string
}

function createStackedPlanesBufferGeometry(
  n: number,
  width: number,
  height: number,
  spacing: number,
  heightSegments: number,
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry()
  const numVertices = n * (heightSegments + 1) * 2
  const numFaces = n * heightSegments * 2

  const positions = new Float32Array(numVertices * 3)
  const indices = new Uint32Array(numFaces * 3)
  const uvs = new Float32Array(numVertices * 2)

  let vertexOffset = 0
  let indexOffset = 0
  let uvOffset = 0

  const totalWidth = n * width + (n - 1) * spacing
  const xOffsetBase = -totalWidth / 2

  for (let i = 0; i < n; i++) {
    const xOffset = xOffsetBase + i * (width + spacing)
    const uvXOffset = Math.random() * 300
    const uvYOffset = Math.random() * 300

    for (let j = 0; j <= heightSegments; j++) {
      const y = height * (j / heightSegments - 0.5)
      const v0 = [xOffset, y, 0]
      const v1 = [xOffset + width, y, 0]

      positions.set([...v0, ...v1], vertexOffset * 3)

      const uvY = j / heightSegments
      uvs.set([uvXOffset, uvY + uvYOffset, uvXOffset + 1, uvY + uvYOffset], uvOffset)

      if (j < heightSegments) {
        const a = vertexOffset,
          b = vertexOffset + 1,
          c = vertexOffset + 2,
          d = vertexOffset + 3
        indices.set([a, b, c, c, b, d], indexOffset)
        indexOffset += 6
      }

      vertexOffset += 2
      uvOffset += 4
    }
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2))
  geometry.setIndex(new THREE.BufferAttribute(indices, 1))
  geometry.computeVertexNormals()

  return geometry
}

const MergedPlanes = forwardRef<
  THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>,
  {
    material: THREE.ShaderMaterial
    width: number
    count: number
    height: number
  }
>(({ material, width, count, height }, ref) => {
  const mesh = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null!)

  useImperativeHandle(ref, () => mesh.current)

  const geometry = useMemo(
    () => createStackedPlanesBufferGeometry(count, width, height, 0, 100),
    [count, width, height],
  )

  useFrame((_, delta) => {
    mesh.current.material.uniforms.time.value += 0.1 * delta
  })

  return <mesh ref={mesh} geometry={geometry} material={material} />
})

MergedPlanes.displayName = "MergedPlanes"

const PlaneNoise = forwardRef<
  THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>,
  {
    material: THREE.ShaderMaterial
    width: number
    count: number
    height: number
  }
>((props, ref) => (
  <MergedPlanes ref={ref} material={props.material} width={props.width} count={props.count} height={props.height} />
))

PlaneNoise.displayName = "PlaneNoise"

const DirLight: FC<{ position: [number, number, number]; color: string }> = ({ position, color }) => {
  const dir = useRef<THREE.DirectionalLight>(null!)

  useEffect(() => {
    if (!dir.current) return
    const cam = dir.current.shadow.camera as THREE.Camera & {
      top: number
      bottom: number
      left: number
      right: number
      far: number
    }
    cam.top = 24
    cam.bottom = -24
    cam.left = -24
    cam.right = 24
    cam.far = 64
    dir.current.shadow.bias = -0.004
  }, [])

  return <directionalLight ref={dir} color={color} intensity={1} position={position} />
}

const Beams: FC<BeamsProps> = ({
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = "#ffffff",
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = 0,
  backgroundColor = "#000000",
}) => {
  const meshRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null!)

  // Determine if light or dark theme based on background color
  const isLightTheme = backgroundColor !== "#000000" && backgroundColor.toLowerCase() !== "#000000"

  const beamMaterial = useMemo(
    () =>
      extendMaterial(THREE.MeshStandardMaterial, {
        header: `
  varying vec3 vEye;
  varying float vNoise;
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float time;
  uniform float uSpeed;
  uniform float uNoiseIntensity;
  uniform float uScale;
  uniform float uIsLight;
  ${noise}`,
        vertexHeader: `
  float getPos(vec3 pos) {
    vec3 noisePos =
      vec3(pos.x * 0., pos.y - uv.y, pos.z + time * uSpeed * 3.) * uScale;
    return cnoise(noisePos);
  }

  vec3 getCurrentPos(vec3 pos) {
    vec3 newpos = pos;
    newpos.z += getPos(pos);
    return newpos;
  }

  vec3 getNormal(vec3 pos) {
    vec3 curpos = getCurrentPos(pos);
    vec3 nextposX = getCurrentPos(pos + vec3(0.01, 0.0, 0.0));
    vec3 nextposZ = getCurrentPos(pos + vec3(0.0, -0.01, 0.0));
    vec3 tangentX = normalize(nextposX - curpos);
    vec3 tangentZ = normalize(nextposZ - curpos);
    return normalize(cross(tangentZ, tangentX));
  }`,
        fragmentHeader: "",
        vertex: {
          "#include <begin_vertex>": `transformed.z += getPos(transformed.xyz);`,
          "#include <beginnormal_vertex>": `objectNormal = getNormal(position.xyz);`,
        },
        fragment: {
          "#include <dithering_fragment>": `
    float randomNoise = noise(gl_FragCoord.xy);
    if (uIsLight > 0.5) {
      gl_FragColor.rgb += randomNoise / 20. * uNoiseIntensity;
    } else {
      gl_FragColor.rgb -= randomNoise / 15. * uNoiseIntensity;
    }`,
        },
        material: { fog: true },
        uniforms: {
          diffuse: new THREE.Color(...hexToNormalizedRGB(isLightTheme ? "#3730a3" : "#000000")),
          time: { shared: true, mixed: true, linked: true, value: 0 },
          roughness: isLightTheme ? 0.15 : 0.3,
          metalness: isLightTheme ? 0.6 : 0.3,
          uSpeed: { shared: true, mixed: true, linked: true, value: speed },
          envMapIntensity: isLightTheme ? 20 : 10,
          uNoiseIntensity: noiseIntensity,
          uScale: scale,
          uIsLight: isLightTheme ? 1.0 : 0.0,
        },
      }),
    [speed, noiseIntensity, scale, isLightTheme],
  )

  return (
    <CanvasWrapper>
      <group rotation={[0, 0, degToRad(rotation)]}>
        <PlaneNoise ref={meshRef} material={beamMaterial} count={beamNumber} width={beamWidth} height={beamHeight} />
        <DirLight color={lightColor} position={[0, 3, 10]} />
      </group>
      <ambientLight intensity={1} />
      <color attach="background" args={[backgroundColor]} />
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={30} />
    </CanvasWrapper>
  )
}

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "lg"
  children: React.ReactNode
}

const BeamButton = ({ variant = "default", size = "sm", className = "", children, ...props }: ButtonProps) => {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark")

  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"

  const variants = isDark
    ? {
        default: "bg-white text-black hover:bg-gray-100 focus-visible:ring-white/20",
        outline: "border border-white/20 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:border-white/30 focus-visible:ring-white/20",
        ghost: "text-white/90 hover:text-white hover:bg-white/10 focus-visible:ring-white/20",
      }
    : {
        default: "bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-400/50 shadow-lg shadow-purple-600/20",
        outline: "border-2 border-purple-600 bg-white/80 backdrop-blur-xl text-purple-600 hover:bg-purple-50 hover:border-purple-700 focus-visible:ring-purple-400/50",
        ghost: "text-purple-600 hover:text-purple-700 hover:bg-purple-100/50 focus-visible:ring-purple-400/50",
      }

  const sizes = {
    sm: "h-9 px-4 py-2 text-sm",
    lg: "px-8 py-6 text-lg",
  }

  const shimmerColor = isDark ? "via-white/20" : "via-purple-200/40"

  return (
    <button
      className={`group relative overflow-hidden rounded-full ${baseClasses} ${variants[variant]} ${sizes[size]} ${className} transition-all duration-300`}
      {...props}
    >
      <span className="relative z-10 flex items-center">{children}</span>
      <div className={`absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent ${shimmerColor} to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out`} />
    </button>
  )
}

// ============================================================================
// MAIN HERO COMPONENT
// ============================================================================

/**
 * Ethereal Beams Hero - Customized for Lil Cheesecake Corner
 *
 * A mesmerizing hero section featuring animated 3D light beams with glassmorphic navigation.
 * Customized for the cheesecake business with appropriate branding and messaging.
 */
export default function EtherealBeamsHero() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Determine if we're in dark mode
  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark")
  
  // ========== THEME-AWARE CONFIGURATION ==========
  
  // Base Background Colors
  const backgroundColor = isDark ? "#000000" : "#f5f3ff"
  
  // Text Colors with improved contrast
  const textColor = isDark ? "text-white" : "text-gray-950"
  const subtitleColor = isDark ? "text-gray-300" : "text-gray-700"
  
  // 3D Beam Settings
  const lightColor = isDark ? "#a78bfa" : "#7c3aed" // More saturated purple for light mode
  const beamNumber = isDark ? 22 : 28 // More beams in light mode for better effect
  const beamScale = isDark ? 0.15 : 0.1 // Smaller scale for crisper beams in light mode
  
  // Gradient Overlays - Multiple layers with different opacities and blend modes
  const topGradient = isDark
    ? "from-black/40 via-black/20 to-transparent"
    : "from-purple-300/20 via-purple-200/10 to-transparent"
  
  const bottomGradient = isDark
    ? "from-transparent via-black/10 to-black/80"
    : "from-transparent via-purple-100/15 to-white/70"
  
  // Text Shadow/Glow Effects
  const headingShadow = isDark
    ? "drop-shadow(0 0 20px rgba(0,0,0,0.8))"
    : "drop-shadow(0 2px 8px rgba(124, 58, 237, 0.15))"
  
  const subtitleShadow = isDark
    ? "drop-shadow(0 0 10px rgba(0,0,0,0.6))"
    : "drop-shadow(0 1px 4px rgba(0,0,0,0.08))"

  return (
    <div className={`relative z-10 w-full overflow-hidden transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-purple-50 via-white to-purple-50/30'}`}>
      {/* ========== BEAMS BACKGROUND LAYER ========== */}
      <div className="absolute inset-0 z-0">
        <Beams
          beamWidth={2}
          beamHeight={18}
          beamNumber={beamNumber}
          lightColor={lightColor}
          speed={2.5}
          noiseIntensity={isDark ? 2 : 2.8}
          scale={beamScale}
          rotation={45}
          backgroundColor={backgroundColor}
        />
      </div>

      {/* ========== TOP GRADIENT OVERLAY (Additive/Soft light effect) ========== */}
      <div 
        className={`absolute inset-0 z-[2] bg-gradient-to-b ${topGradient} pointer-events-none transition-all duration-500`}
        style={{
          mixBlendMode: isDark ? "multiply" : "screen",
          opacity: isDark ? 1 : 0.8,
        }}
      />

      {/* ========== HERO CONTENT LAYER ========== */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full py-20">
          <div className="mx-auto max-w-4xl text-center">
            {/* Main Heading */}
            <h1 
              className={`mb-6 text-6xl font-bold tracking-tight ${textColor} sm:text-7xl lg:text-8xl transition-all duration-500`}
              style={{
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.02em',
                filter: headingShadow,
              }}
            >
              <span className={`transition-colors duration-500 ${isDark ? 'text-red-500' : 'text-red-600'}`}>L</span>il{" "}
              <span className={`transition-colors duration-500 ${isDark ? 'text-red-500' : 'text-red-600'}`}>C</span>heese
              <span className={`transition-colors duration-500 ${isDark ? 'text-red-500' : 'text-red-600'}`}>C</span>ake
              <br />
              <span
                className={`bg-gradient-to-r transition-all duration-500 bg-clip-text text-transparent ${
                  isDark
                    ? "from-white via-gray-300 to-gray-400"
                    : "from-purple-700 via-violet-600 to-purple-600"
                }`}
              >
                <span className={`transition-colors duration-500 ${isDark ? 'text-red-500' : 'text-red-600'}`}>C</span>orner
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`mb-10 text-lg leading-8 ${subtitleColor} sm:text-xl lg:text-2xl max-w-3xl mx-auto transition-all duration-500`}
              style={{
                filter: subtitleShadow,
              }}
            >
              Handcrafted cheesecakes made with love and the finest ingredients. Every slice is a moment of pure bliss.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/products">
                <BeamButton
                  size="sm"
                  className={`font-semibold transition-all duration-300 ${
                    isDark ? "shadow-2xl shadow-white/25" : "shadow-lg shadow-purple-600/30"
                  }`}
                >
                  Explore Flavors
                  <ArrowRight className="ml-2 h-5 w-5" />
                </BeamButton>
              </Link>
              <Link href="/order">
                <BeamButton variant="outline" size="sm" className="font-semibold">
                  Order Now
                </BeamButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========== BOTTOM GRADIENT OVERLAY (Subtractive/Multiply effect) ========== */}
      <div
        className={`absolute inset-0 z-[5] bg-gradient-to-b ${bottomGradient} pointer-events-none transition-all duration-500`}
        style={{
          mixBlendMode: isDark ? "multiply" : "overlay",
          opacity: isDark ? 1 : 0.7,
        }}
      />
    </div>
  )
}
