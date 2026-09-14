import { Nav } from '@/components/Nav'
import { Start } from '@/sections/Start'
import { ExecutiveView } from '@/sections/exec/ExecutiveView'
import { Footer } from '@/components/Footer'
import { Opening } from '@/sections/Opening'
import { Question } from '@/sections/Question'
import { Problem } from '@/sections/Problem'
import { OperatedService } from '@/sections/OperatedService'
import { Contract } from '@/sections/Contract'
import { Context } from '@/sections/Context'
import { Loop } from '@/sections/Loop'
import { Authority } from '@/sections/Authority'
import { Axes } from '@/sections/Axes'
import { Evidence } from '@/sections/Evidence'
import { Value } from '@/sections/Value'
import { Pillars } from '@/sections/Pillars'
import { PriorArt } from '@/sections/PriorArt'
import { Challenge } from '@/sections/Challenge'
import { DiagnosticSection } from '@/sections/DiagnosticSection'
import { People } from '@/sections/People'
import { Path } from '@/sections/Path'
import { Status } from '@/sections/Status'

export default function App() {
  return (
    <>
      <Nav />
      <main id="main">
        <Start />
        <ExecutiveView />
        <Opening />
        <Question />
        <Problem />
        <OperatedService />
        <Contract />
        <Context />
        <Loop />
        <Authority />
        <Axes />
        <Evidence />
        <Value />
        <Pillars />
        <PriorArt />
        <Challenge />
        <DiagnosticSection />
        <People />
        <Path />
        <Status />
      </main>
      <Footer />
    </>
  )
}
