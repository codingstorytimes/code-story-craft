import { Story } from "@/common/types/types";
import { EnumStoryType } from "@/common/types/story";




export const sampleStories: Story[] = [
    {
      id: "1",
      title: "The Day I Discovered Recursion (And Almost Broke My Mind)",
      content: `# The Day I Discovered Recursion (And Almost Broke My Mind)
  
  Picture this: me, a junior developer, staring at a function that called itself. My first thought? "This is broken. Functions can't call themselves... can they?"
  
  ## The Problem
  
  I was working on a file system explorer and needed to traverse directories. My mentor showed me this:
  
  \`\`\`javascript
  function exploreDirectory(path) {
    const items = fs.readdirSync(path);
    
    items.forEach(item => {
      const fullPath = path + '/' + item;
      if (fs.statSync(fullPath).isDirectory()) {
        exploreDirectory(fullPath); // Wait... what?
      } else {
        console.log('File:', fullPath);
      }
    });
  }
  \`\`\`
  
  ## The Revelation
  
  "It's like Russian nesting dolls," my mentor explained. "Each doll contains a smaller version of itself, until you reach the smallest one that can't be opened further."
  
  That's when it clicked. Recursion isn't a function breaking the rules—it's a function solving a problem by breaking it into smaller, identical problems.
  
  ## The Base Case Epiphany
  
  The real magic moment came when I understood base cases. Without them, recursion is like an infinite mirror reflecting into itself. With them, it's like a ladder that knows when to stop climbing.
  
  ## My New Mental Model
  
  Now I think of recursion as:
  1. **Ask**: Can I solve this problem directly? (Base case)
  2. **If no**: Break it into a smaller version of the same problem
  3. **Trust**: The smaller version will eventually reach the base case
  4. **Combine**: Use the smaller solution to build the bigger one
  
  Recursion taught me that sometimes the most elegant solutions come from believing in the process, even when it feels like magic.`,
      excerpt: "Picture this: me, a junior developer, staring at a function that called itself. My first thought? 'This is broken. Functions can't call themselves... can they?'",
      author: "Sarah Chen",
      category: "Algorithms",
    storyType: EnumStoryType.Story,
      readTime: "4 min read",
      likes: 127,
      comments: 23,
      tags: ["recursion", "javascript", "learning", "debugging"],
      createdAt: "2024-01-15"
    },
    {
      id: "2", 
      title: "SOLID: The Superhero Team That Saved My Codebase",
      content: `# SOLID: The Superhero Team That Saved My Codebase
  
  Once upon a time, in the chaotic kingdom of Codeland, there lived a young developer whose codebase was a tangled mess. Then came five superheroes, each with a special power to bring order to the chaos.
  
  ## Meet the SOLID Squad
  
  ### **S** - Single Responsibility Spider
  *"With great power comes great responsibility... but just ONE responsibility!"*
  
  Spider only did one thing at a time. No fighting crime AND delivering pizza. Each class, each function had one job and did it well.
  
  \`\`\`typescript
  // Before: Pizza-delivering crime fighter (bad)
  class SuperHero {
    fightCrime() { /* fights crime */ }
    deliverPizza() { /* delivers pizza */ }
    payTaxes() { /* handles finances */ }
  }
  
  // After: Focused heroes (good)
  class CrimeFighter {
    fightCrime() { /* fights crime */ }
  }
  
  class PizzaDeliverer {
    deliverPizza() { /* delivers pizza */ }
  }
  \`\`\`
  
  ### **O** - Open-Closed Oracle
  *"I am open to new powers, but my core essence remains unchanged!"*
  
  Oracle could gain new abilities without changing her fundamental nature. She extended, never modified.
  
  ### **L** - Liskov Substitution Lion
  *"Any hero can be replaced by their sidekick without breaking the team!"*
  
  Lion ensured that any superhero could be swapped with their apprentice without the team falling apart.
  
  ### **I** - Interface Segregation Invisible
  *"Heroes shouldn't be forced to have powers they don't need!"*
  
  Invisible believed in specialized skill sets. Flying heroes didn't need underwater breathing.
  
  ### **D** - Dependency Inversion Dragon
  *"High-level heroes shouldn't depend on low-level minions!"*
  
  Dragon taught that powerful heroes should rely on abstract concepts, not specific implementation details.
  
  ## The Transformation
  
  With the SOLID squad's help, our developer's codebase transformed from a spaghetti monster into a well-organized superhero headquarters where:
  
  - Each component had a clear mission (Single Responsibility)
  - New features could be added without breaking existing ones (Open-Closed)
  - Team members were truly interchangeable (Liskov Substitution)
  - No one was forced to implement unnecessary powers (Interface Segregation)
  - High-level strategy didn't depend on low-level implementation (Dependency Inversion)
  
  And they all coded happily ever after... until the next refactor.`,
      excerpt: "Once upon a time, in the chaotic kingdom of Codeland, there lived a young developer whose codebase was a tangled mess. Then came five superheroes...",
      author: "Marcus Rodriguez",
      category: "Design Patterns",
    storyType: EnumStoryType.Analogy,
      readTime: "6 min read", 
      likes: 203,
      comments: 45,
      tags: ["SOLID", "design-patterns", "clean-code", "superhero"],
      createdAt: "2024-01-12"
    },
    {
      id: "3",
      title: "HTTP Status Codes: The Restaurant Analogy That Stuck",
      content: `# HTTP Status Codes: The Restaurant Analogy That Stuck
  
  Remembering HTTP status codes used to be impossible for me. Then my friend compared them to restaurant experiences, and everything clicked.
  
  ## The Restaurant Visit
  
  Imagine you're visiting a restaurant. Here's what each status code family represents:
  
  ### 1xx - Information (The Host)
  - **100 Continue**: "Right this way, we're preparing your table"
  - **101 Switching Protocols**: "Actually, let's move you to the patio instead"
  
  ### 2xx - Success (Happy Meals)
  - **200 OK**: "Here's your delicious meal, exactly as ordered"
  - **201 Created**: "We've prepared a new dish just for you"
  - **204 No Content**: "Your order is complete, but there's nothing to serve"
  
  ### 3xx - Redirection (Musical Chairs)
  - **301 Moved Permanently**: "This restaurant moved across town forever"
  - **302 Found**: "This restaurant is temporarily at another location"
  - **304 Not Modified**: "Your usual order hasn't changed since last time"
  
  ### 4xx - Client Error (Your Fault)
  - **400 Bad Request**: "I can't understand your order"
  - **401 Unauthorized**: "You need to show ID first"
  - **403 Forbidden**: "You're not allowed in the VIP section"
  - **404 Not Found**: "We don't serve unicorn burgers here"
  - **408 Request Timeout**: "You took too long to order"
  
  ### 5xx - Server Error (Restaurant's Fault)
  - **500 Internal Server Error**: "Our kitchen is on fire"
  - **502 Bad Gateway**: "Our delivery driver got lost"
  - **503 Service Unavailable**: "We're temporarily closed for repairs"
  
  ## The Memory Trick
  
  Now when I see a status code, I immediately think:
  - **1xx**: Host is talking
  - **2xx**: Kitchen delivered  
  - **3xx**: Table changed
  - **4xx**: You messed up
  - **5xx**: We messed up
  
  This restaurant analogy has saved me countless times during debugging. When my API returns 403, I know the user needs better "reservations" (permissions). When I get 502, I know the "delivery driver" (gateway) has issues.
  
  Sometimes the best learning happens over a good meal metaphor!`,
      excerpt: "Remembering HTTP status codes used to be impossible for me. Then my friend compared them to restaurant experiences, and everything clicked.",
      author: "Alex Kim",
      category: "APIs",
      storyType: EnumStoryType.Mnemonic,
      readTime: "3 min read",
      likes: 89,
      comments: 12,
      tags: ["HTTP", "status-codes", "API", "debugging", "memory-tricks"],
      createdAt: "2024-01-10"
    },
    {
      id: "4",
      title: "Git Branching: My Parallel Universe Disaster",
      content: `# Git Branching: My Parallel Universe Disaster
  
  Three months into my first job, I learned about Git branches the hard way. Let me tell you about the day I accidentally created a parallel universe in our codebase.
  
  ## The Setup
  
  I was working on a new feature when my manager said, "Create a branch for that." Simple enough, right? 
  
  \`git checkout -b feature/user-authentication\`
  
  What I didn't realize was that I was about to enter a dimension where my code would live in isolation from everyone else's reality.
  
  ## The Parallel Universe
  
  For two weeks, I lived in my feature branch, making commits, writing tests, feeling productive. Meanwhile, in the main branch (the "real world"), my teammates were:
  - Fixing critical bugs
  - Updating dependencies  
  - Refactoring the entire authentication system I was building
  
  I was obliviously building on top of old code, creating a feature that would soon conflict with everything.
  
  ## The Collision
  
  When I finally tried to merge back to main:
  
  \`\`\`bash
  git checkout main
  git pull origin main
  git merge feature/user-authentication
  # CONFLICT HELL BREAKS LOOSE
  \`\`\`
  
  My screen exploded with merge conflicts. It looked like two universes had collided, and I was standing in the wreckage.
  
  ## The Lesson
  
  My senior developer sat me down and drew this on a whiteboard:
  
  \`\`\`
  main:     A---B---C---D---E
                 \\           /
  feature:        F---G---H
  \`\`\`
  
  "Think of branches as parallel timelines," he said. "You created an alternate reality at point B, but the main timeline kept moving. Now you need to reconcile the differences."
  
  ## My New Mental Model
  
  Now I think of Git branching like writing alternate ending to a story:
  
  1. **Branching**: "What if the story went this way instead?"
  2. **Commits**: Individual scenes in your alternate story
  3. **Merging**: "Let's see if this alternate ending fits with the main story"
  4. **Conflicts**: "Wait, these two versions of the story contradict each other"
  
  ## The Prevention Strategy
  
  I learned to regularly sync my parallel universe with reality:
  
  \`\`\`bash
  # Keep your alternate reality up to date
  git checkout main
  git pull origin main
  git checkout feature/user-authentication  
  git rebase main  # or git merge main
  \`\`\`
  
  Now I never let my branches drift too far from reality. Parallel universes are fun in science fiction, but in code, they're just technical debt waiting to happen.`,
      excerpt: "Three months into my first job, I learned about Git branches the hard way. Let me tell you about the day I accidentally created a parallel universe in our codebase.",
      author: "Jamie Foster",
      category: "DevOps",
      storyType: EnumStoryType.Tutorial,
      readTime: "5 min read",
      likes: 156,
      comments: 31,
      tags: ["git", "branching", "version-control", "learning", "mistakes"],
      createdAt: "2024-01-08"
    },
    {
      id: "5",
      title: "The Big O Notation Restaurant: A Speed Dating Story",
      content: `# The Big O Notation Restaurant: A Speed Dating Story
  
  Understanding Big O notation clicked for me when I imagined algorithms as different types of restaurants trying to serve customers. Let me tell you about the weirdest speed dating event ever.
  
  ## The Contestants
  
  ### O(1) - The Fast Food Counter
  *"I serve everyone in exactly 30 seconds, no matter if there's 1 person or 1000 people in line."*
  
  This place has everything pre-made. One customer? 30 seconds. Thousand customers? Still 30 seconds per person. They've mastered the art of constant time service.
  
  ### O(log n) - The Binary Search Bistro  
  *"I cut my menu in half each time you ask a question."*
  
  "Do you want something sweet or savory?" Half the menu disappears. "Hot or cold?" Half again. They find your perfect dish by elimination, getting faster as they get smarter.
  
  ### O(n) - The Linear Lunch Line
  *"I serve customers one by one, in order. Fair and simple."*
  
  One customer takes 5 minutes. Ten customers take 50 minutes. They're honest about their limitations and scale predictably.
  
  ### O(n log n) - The Merge Sort Steakhouse
  *"I organize everyone into small groups, serve each group optimally, then merge the results."*
  
  They're sophisticated. They break large parties into smaller tables, serve each efficiently, then coordinate to deliver everything together. More complex, but handles big groups well.
  
  ### O(n²) - The Nested Loop Noodle House
  *"For every customer, I ask every other customer what they want too."*
  
  One customer orders for themselves. Two customers? Each asks the other what they want. Ten customers? Each of the 10 asks all 10 what they want. Things get chaotic quickly.
  
  ### O(2ⁿ) - The Exponential Experience
  *"I consider every possible combination of ingredients for every customer."*
  
  One customer gets 2 options. Two customers get 4 options total. Three customers get 8 options. This place is mathematically doomed but creates mind-blowing experiences... when it doesn't crash.
  
  ## The Speed Dating Results
  
  - **O(1)** got everyone's number instantly
  - **O(log n)** impressed everyone with smart questions  
  - **O(n)** was reliable but slow with big groups
  - **O(n log n)** handled the crowd like a pro
  - **O(n²)** created chaos asking everyone about everyone
  - **O(2ⁿ)** exploded when more than 5 people showed up
  
  ## The Real World Application
  
  Now when I write code, I ask myself: "What kind of restaurant am I building?"
  
  - Need instant lookup? Build an O(1) hash table counter
  - Searching sorted data? O(log n) binary search bistro
  - Processing each item once? O(n) linear lunch line
  - Sorting data? O(n log n) merge sort steakhouse
  - Comparing everything to everything? Avoid the O(n²) noodle nightmare
  - Generating all possibilities? Only use O(2ⁿ) for very small inputs
  
  The moral of the story? Choose your algorithmic restaurant wisely. Your users are hungry, and they don't like waiting!`,
      excerpt: "Understanding Big O notation clicked for me when I imagined algorithms as different types of restaurants trying to serve customers.",
      author: "David Park",
      category: "Algorithms",
      storyType: EnumStoryType.Story,
      readTime: "7 min read",
      likes: 234,
      comments: 52,
      tags: ["big-o", "algorithms", "performance", "complexity", "restaurant"],
      createdAt: "2024-01-05"
    }
  ];



  export const featuredStories = [
    {
      id:"",
      title: "The Tale of Two Arrays: A Love Story",
      excerpt: "A beautiful story about merge sort and quick sort finding love in the world of algorithms...",
      author: "Sarah Chen",
      readTime: "5 min",
      category: "Algorithms",
      content:""
    },
    {
      title: "SOLID Principles: The Superhero Team",
      excerpt: "Meet the superhero team that saves codebases from chaos and technical debt...",
      author: "Mike Rodriguez", 
      readTime: "8 min",
      category: "Design Patterns"
    },
    {
      title: "The Database That Cried ACID",
      excerpt: "Little Bobby Tables learns about database transactions through tears and triumph...",
      author: "Jennifer Wong",
      readTime: "6 min", 
      category: "Database"
    }
  ];

  export const mockStories = [
    {
      id: "1",
      title: "The Tale of Two Arrays: A Love Story Between Merge Sort and Quick Sort",
      excerpt: "Once upon a time in the land of Algorithmica, there lived two sorting algorithms who couldn't be more different. Merge Sort was methodical and predictable, while Quick Sort was fast but unpredictable...",
      author: "Sarah Chen",
      category: "Algorithms",
      readTime: "5 min read",
      likes: 124,
      comments: 18,
      tags: ["sorting", "algorithms", "story", "beginner"],
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      title: "SOLID Principles: The Superhero Team",
      excerpt: "Imagine the SOLID principles as a superhero team. Single Responsibility Man can only do one thing, but he does it perfectly. Open-Closed Woman can extend her powers without changing her core abilities...",
      author: "Mike Rodriguez",
      category: "Design Patterns",
      readTime: "8 min read",
      likes: 89,
      comments: 12,
      tags: ["SOLID", "OOP", "design-patterns", "mnemonics"],
      createdAt: "2024-01-14"
    },
    {
      id: "3",
      title: "The Database That Cried ACID",
      excerpt: "Little Bobby Tables was working late one night when his database started crying. 'What's wrong?' he asked. 'I lost my ACID properties!' sobbed the database. This is the story of how Bobby helped restore Atomicity, Consistency, Isolation, and Durability...",
      author: "Jennifer Wong",
      category: "Database",
      readTime: "6 min read",
      likes: 156,
      comments: 24,
      tags: ["database", "ACID", "transactions", "story"],
      createdAt: "2024-01-13"
    },
    {
      id: "4",
      title: "The Async/Await Café: A Promise-Based Love Story",
      excerpt: "In downtown JavaScript City, there's a little café called 'The Promise'. The owner, Mr. Async, serves the best coffee, but only if you're willing to await your order...",
      author: "David Kim",
      category: "JavaScript",
      readTime: "7 min read",
      likes: 203,
      comments: 31,
      tags: ["javascript", "async", "promises", "story"],
      createdAt: "2024-01-12"
    },
    {
      id: "5",
      title: "REST vs GraphQL: The Great API Debate",
      excerpt: "Picture this: REST and GraphQL walk into a bar. The bartender asks, 'What'll it be?' REST orders exactly what's on the menu, while GraphQL asks for a custom cocktail with only the ingredients they want...",
      author: "Emma Thompson",
      category: "APIs",
      readTime: "4 min read",
      likes: 78,
      comments: 9,
      tags: ["REST", "GraphQL", "APIs", "comparison"],
      createdAt: "2024-01-11"
    }
  ];