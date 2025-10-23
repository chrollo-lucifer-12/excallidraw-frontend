import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Users,
  Zap,
  Lock,
  Sparkles,
  ArrowRight,
  MousePointer2,
  Shapes,
  Type,
  Image as ImageIcon,
  Lightbulb,
  Globe,
  Github,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Pencil className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Whiteboard</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
              Real-time collaboration
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Sketch ideas.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Collaborate freely.
              </span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              A virtual whiteboard for sketching hand-drawn diagrams,
              brainstorming with your team, and bringing ideas to life in
              real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-base px-8"
              >
                Start Drawing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8">
                <Github className="w-4 h-4 mr-2" />
                View Demo
              </Button>
            </div>
          </div>

          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-2xl border-2 border-slate-200 shadow-2xl overflow-hidden bg-slate-50">
              <div className="aspect-video bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <div className="w-16 h-16 rounded-xl bg-white shadow-lg flex items-center justify-center border-2 border-blue-200 animate-pulse">
                      <Pencil className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="w-16 h-16 rounded-xl bg-white shadow-lg flex items-center justify-center border-2 border-cyan-200 animate-pulse delay-75">
                      <Shapes className="w-8 h-8 text-cyan-600" />
                    </div>
                    <div className="w-16 h-16 rounded-xl bg-white shadow-lg flex items-center justify-center border-2 border-slate-200 animate-pulse delay-150">
                      <Type className="w-8 h-8 text-slate-600" />
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm">
                    Interactive whiteboard preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Everything you need to create
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Powerful tools that feel natural and intuitive
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow border-slate-200">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <MousePointer2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Hand-drawn feel</h3>
                <p className="text-slate-600">
                  Sketchy, hand-drawn style that brings a human touch to your
                  diagrams and ideas.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border-slate-200">
                <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Real-time collaboration
                </h3>
                <p className="text-slate-600">
                  Work together with your team in real-time. See cursors, edits,
                  and changes instantly.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border-slate-200">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning fast</h3>
                <p className="text-slate-600">
                  Built for speed. No lag, no delays. Just smooth, responsive
                  drawing.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border-slate-200">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <Shapes className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Rich shapes library
                </h3>
                <p className="text-slate-600">
                  Rectangles, circles, arrows, lines, and more. Everything you
                  need to visualize ideas.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border-slate-200">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Private & secure</h3>
                <p className="text-slate-600">
                  Your data is encrypted and secure. Share only what you want,
                  when you want.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border-slate-200">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <ImageIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Export anywhere</h3>
                <p className="text-slate-600">
                  Export to PNG, SVG, or share a live link. Your work, your way.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline" className="px-3 py-1">
                  <Lightbulb className="w-3.5 h-3.5 mr-1.5 inline" />
                  For everyone
                </Badge>
                <h2 className="text-4xl font-bold">
                  From quick sketches to complex diagrams
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Whether you're brainstorming solo, teaching a class, planning
                  a project, or designing a system architecture, our whiteboard
                  adapts to your needs.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span className="text-slate-700">
                      Infinite canvas for unlimited creativity
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span className="text-slate-700">
                      Keyboard shortcuts for power users
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <span className="text-slate-700">
                      Works on desktop, tablet, and mobile
                    </span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 via-cyan-50 to-slate-100 border-2 border-slate-200 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Globe className="w-20 h-20 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">Whiteboard illustration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-600 to-cyan-600 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to start creating?
            </h2>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
              Join thousands of teams using our whiteboard to collaborate and
              bring their ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-base px-8 bg-white hover:bg-slate-50"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        <footer className="border-t bg-slate-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold">Whiteboard</span>
              </div>
              <p className="text-sm text-slate-600">
                Built with creativity and collaboration in mind.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
