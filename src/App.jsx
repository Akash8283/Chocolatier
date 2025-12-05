import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './App.css'
import CustomCursor from './components/CustomCursor'
import ScrollVideo from './components/ScrollVideo'
import Header from './components/Header'

function App() {

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: true,
      touchMultiplier: 2,
    })

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000)
      })
    }
  }, [])

  return (
    <>
      <CustomCursor />
      <Header />
      <Routes>
        <Route path='/' element={<ScrollVideo />}></Route>
      </Routes>
    </>
  )
}

export default App
