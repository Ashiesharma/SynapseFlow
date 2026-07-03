export default function Lights() {
    return (
        <>
            <ambientLight intensity={0.18} />

            <pointLight
                position={[0, 2.5, 2]}
                intensity={2.2}
                color="#1faaff"
            />

            <pointLight
                position={[-4, 1.5, -3]}
                intensity={1.2}
                color="#0b5cff"
            />

            <directionalLight
                position={[4, 6, 5]}
                intensity={0.7}
                color="#ffffff"
            />
        </>
    );
}