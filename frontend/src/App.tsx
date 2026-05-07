import { useState, useEffect } from 'react'
import ChatSidebar from './components/ChatSidebar'
import CourseMap from './components/CourseMap'
import DetailPanel from './components/DetailPanel'
import { getCourses, type Course, type ChatResponse } from './api/courses'

export default function App() {
  const [mapRevealed, setMapRevealed] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [courses, setCourses] = useState<Record<string, Course> | null>(null)
  const [loading, setLoading] = useState(true)
  const [completedCourses, setCompletedCourses] = useState<string[]>([])
  const [courseStates, setCourseStates] = useState<Record<string, string>>({})

  useEffect(() => {
    console.log('📥 Starting to fetch courses...')
    getCourses()
      .then(data => {
        console.log('✅ Courses loaded:', Object.keys(data).length, 'courses')
        setCourses(data)
      })
      .catch(err => {
        console.error('❌ Failed to load courses:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <header>
        <div className="logo">
          <div className="logo-mark">🧭</div>
          <div className="logo-text">UBC <span>Course Navigator</span></div>
        </div>
        <a
          className="team-link"
          href="https://github.com/jennachoi/CIC2026S_Satoori"
          target="_blank"
          rel="noreferrer"
        >
          CIC2026S_Satoori ↗
        </a>
      </header>

      <div className="app">
        <ChatSidebar
          onRevealMap={() => setMapRevealed(true)}
          completedCourses={completedCourses}
          onChatResponse={(response: ChatResponse) => {
            setCompletedCourses(prev => [...prev, ...Object.keys(response.course_states)])
            setCourseStates(response.course_states)
          }}
        />
        <main className="main">
          <div className="main-grid-bg" />
          {courses && <CourseMap revealed={mapRevealed} onCourseClick={setSelectedCourse} courses={courses} courseStates={courseStates} />}
        </main>
      </div>

      {courses && <DetailPanel courseId={selectedCourse} onClose={() => setSelectedCourse(null)} courses={courses} />}
    </>
  )
}
