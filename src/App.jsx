import { Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

import Home from './pages/Home'
import TestsList from './pages/TestsList'
import TestDetails from './pages/TestDetails'
import CreateTest from './pages/CreateTest'
import EditTest from './pages/EditTest'
import TakeTest from './pages/TakeTest'
import TestResults from './pages/TestResults'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />
      <main className="flex-1 py-8">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tests" element={<TestsList />} />
            <Route path="/tests/create" element={<CreateTest />} />
            <Route path="/tests/:id" element={<TestDetails />} />
            <Route path="/tests/:id/edit" element={<EditTest />} />
            <Route path="/tests/:id/take" element={<TakeTest />} />
            <Route path="/tests/:id/results" element={<TestResults />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App