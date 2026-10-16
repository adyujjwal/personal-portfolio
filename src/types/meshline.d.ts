// Register meshline's custom R3F elements for JSX.
declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any
    meshLineMaterial: any
  }
}

export {}
