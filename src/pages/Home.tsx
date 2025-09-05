import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PenTool, Users, Zap, Heart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-bg.jpg";
import { useStories } from "@/hooks/useStories";



const Home = () => {
  
  const { getFeaturedStories } = useStories();

const featuredStories = getFeaturedStories()

  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-story-purple/90 via-story-blue/80 to-story-purple/90"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Learn Code Through
            <span className="block bg-gradient-to-r from-story-warm to-white bg-clip-text text-transparent">
              Stories
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Where developers share real-life anecdotes, clever mnemonics, and fictional stories 
            to explain programming concepts. Make learning memorable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/stories">
              <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Stories
              </Button>
            </Link>
            <Link to="/create">
              <Button variant="story" size="lg" className="text-lg px-8 py-4">
                <PenTool className="w-5 h-5 mr-2" />
                Share Your Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Stories Work for Learning Code
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform abstract programming concepts into memorable, relatable experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center group hover:shadow-hover transition-all duration-300 hover:-translate-y-2">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Memorable Learning</h3>
                <p className="text-muted-foreground">
                  Stories create emotional connections that make complex concepts stick in your memory forever.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-hover transition-all duration-300 hover:-translate-y-2">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Community Driven</h3>
                <p className="text-muted-foreground">
                  Learn from real developers sharing their authentic experiences and creative explanations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-hover transition-all duration-300 hover:-translate-y-2">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-story-green/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-story-green" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Quick Understanding</h3>
                <p className="text-muted-foreground">
                  Grasp difficult concepts faster through analogies, mnemonics, and relatable scenarios.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Stories</h2>
              <p className="text-xl text-muted-foreground">Popular tales from our community</p>
            </div>
            <Link to="/stories">
              <Button variant="outline">View All Stories</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredStories.map((story, index) => {
              const {id} = story
              return (<Link key={id} to={`/story/${id}`}>
              <Card className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3">{story.category}</Badge>
                  <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {story.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{story.author}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {story.readTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
              </Link>)}
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">
            Join Our Growing Community
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">127+</div>
              <div className="text-white/80 text-lg">Developer Stories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">2.3k+</div>
              <div className="text-white/80 text-lg">Community Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">15+</div>
              <div className="text-white/80 text-lg">Programming Topics</div>
            </div>
          </div>

          <div className="mt-12">
            <Link to="/create">
              <Button variant="story" size="lg" className="text-lg px-8 py-4">
                Start Sharing Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
