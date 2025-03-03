import React, { Suspense, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, PerspectiveCamera, Environment, Text3D } from '@react-three/drei';
import { motion } from 'framer-motion';
import { GraduationCap, School, BookOpen, Users, BarChart3, Laptop, Play, BookOpenCheck, Brain } from 'lucide-react';

// 3D Scene Components
function EducationalStructure() {
  const groupRef = useRef();

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Book Structure */}
      <group position={[0, 0, 0]}>
        {/* Book Cover */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 3, 0.3]} />
          <meshStandardMaterial color="#2a3f6f" metalness={0.6} roughness={0.2} />
        </mesh>
        
        {/* Book Pages */}
        <mesh position={[0, 0, 0.16]}>
          <boxGeometry args={[3.8, 2.8, 0.01]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>

        {/* Digital Interface Overlay */}
        <mesh position={[0, 0, 0.18]}>
          <planeGeometry args={[3.6, 2.6]} />
          <meshStandardMaterial 
            color="#4f46e5"
            emissive="#4f46e5"
            emissiveIntensity={0.2}
            transparent
            opacity={0.1}
          />
        </mesh>
      </group>

      {/* Orbiting Elements */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group position={[0, 0, 0.5]}>
          {/* Knowledge Spheres */}
          {[0, 1, 2, 3].map((index) => (
            <mesh
              key={index}
              position={[
                Math.cos(index * (Math.PI / 2)) * 2,
                Math.sin(index * (Math.PI / 2)) * 2,
                0
              ]}
            >
              <sphereGeometry args={[0.3]} />
              <meshStandardMaterial 
                color="#4f46e5"
                metalness={0.8}
                roughness={0.2}
                emissive="#4f46e5"
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
        </group>
      </Float>
    </group>
  );
}

function DigitalParticles() {
  const particlesRef = useRef();
  
  useFrame((state) => {
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <group ref={particlesRef}>
      {Array.from({ length: 100 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 0.5) * 4,
            Math.cos(i * 0.5) * 4,
            Math.sin(i * 0.3) * 4
          ]}
        >
          <sphereGeometry args={[0.02]} />
          <meshStandardMaterial
            color="#4f46e5"
            emissive="#4f46e5"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function Enhanced3DScene() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Suspense fallback={null}>
        <EducationalStructure />
        <DigitalParticles />
      </Suspense>
      <OrbitControls 
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.3}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  );
}

// Rest of the component remains exactly the same...
// UI Components
const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
    <div className="relative bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-purple-500 transition-all duration-300">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
        {title}
      </h3>
      <p className="text-gray-400 text-lg leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const StatCard = ({ icon: Icon, value, label }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 border border-gray-800"
  >
    <Icon className="w-8 h-8 text-purple-500 mb-4" />
    <h4 className="text-3xl font-bold text-white mb-2">{value}</h4>
    <p className="text-gray-400">{label}</p>
  </motion.div>
);

const Home = () => {
  return (
    <main className="min-h-screen bg-[#0B1120] text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-[#0B1120]" />
        <div className="absolute inset-0">
          <Enhanced3DScene />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <h1 className="text-7xl font-bold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
                  Future of Learning
                </span>
                <br />
                <span className="text-white">Is Here</span>
              </h1>
              <p className="text-xl mb-8 text-gray-300 leading-relaxed">
                Step into the next generation of education with our immersive VR classrooms. 
                Experience learning like never before with cutting-edge technology and interactive tools.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/teacherlogin" className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300">
                    Teacher Portal
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/studentlogin" className="inline-flex items-center px-8 py-4 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-all duration-300">
                    Student Portal
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Platform Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of education with our comprehensive suite of tools and features
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Laptop}
              title="Virtual Classrooms"
              description="Immersive VR environments designed for interactive learning and collaboration"
            />
            <FeatureCard 
              icon={Users}
              title="Smart Attendance"
              description="AI-powered attendance tracking with real-time analytics and reporting"
            />
            <FeatureCard 
              icon={BookOpen}
              title="Interactive Content"
              description="Engage with materials for your class"
            />
            <FeatureCard 
              icon={BarChart3}
              title="Progress Analytics"
              description="Detailed insights of your class presence"
            />
            
            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 relative"
      >
        <div className="container mx-auto px-4">
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur-xl opacity-20" />
            <div className="relative bg-gray-900/50 backdrop-blur-xl p-12 rounded-2xl border border-gray-800">
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                Ready to Transform Your Learning Experience?
              </h2>
               
              <div className="flex flex-wrap justify-center gap-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/teacherregister" className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300">
                    <School className="mr-2" />
                    Join as Teacher
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/studentregister" className="inline-flex items-center px-8 py-4 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-all duration-300">
                    <GraduationCap className="mr-2" />
                    Join as Student
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default Home;