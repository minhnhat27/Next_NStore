import Navigation from './navigation'
import RightBar from './right-bar'

export default function Header() {
  return (
    <div className="h-24 z-50 px-6 md:px-10 transition-all sticky top-0 bg-black">
      <div className="h-full flex justify-between items-center lg:container lg:mx-auto">
        <Navigation />
        <RightBar />
      </div>
    </div>
  )
}
