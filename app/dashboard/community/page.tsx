"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, MessageCircle, Heart, Send, Shield, Plus, MessagesSquare, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { COMMUNITY_CATEGORIES, CommunityPost, CommunityReply } from "@/lib/types/dashboard"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import confetti from "canvas-confetti"
import { LiveChatRoom } from "@/components/live-chat-room"

const PAGE_SIZE = 10

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [totalPosts, setTotalPosts] = useState(0)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [replies, setReplies] = useState<CommunityReply[]>([])
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null)
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostCategory, setNewPostCategory] = useState<string>("general")
  const [newReply, setNewReply] = useState("")
  const [activeTab, setActiveTab] = useState("explore")
  const [loading, setLoading] = useState(false)
  const [activeMembers, setActiveMembers] = useState(37)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [huggedPosts, setHuggedPosts] = useState<Set<string>>(new Set())
  const [totalHugsReceived, setTotalHugsReceived] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    loadPosts(1, "", "all")
    loadActiveMembers()
    loadUserLikes()
    loadUserHugs()
  }, [])

  const loadPosts = async (targetPage: number = page, search: string = searchQuery, category: string = filterCategory) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      const offset = (targetPage - 1) * PAGE_SIZE

      let query = supabase
        .from("community_posts")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1)

      if (category && category !== "all") {
        query = query.eq("category", category)
      }

      if (search.trim()) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
      }

      const { data, count } = await query
      if (data) {
        setPosts(data)
        setTotalPosts(count || 0)
      }
    } catch (err) {
    }
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setPage(1)
    loadPosts(1, value, filterCategory)
  }

  const handleCategoryFilter = (category: string) => {
    setFilterCategory(category)
    setPage(1)
    loadPosts(1, searchQuery, category)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    loadPosts(newPage, searchQuery, filterCategory)
  }

  const loadActiveMembers = async () => {
    try {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })

      if (!error && count !== null) {
        setActiveMembers(count)
      }
    } catch (err) {
    }
  }

  const loadUserLikes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", user.id)

      if (data) {
        setLikedPosts(new Set(data.map(like => like.post_id)))
      }
    } catch (err) {
    }
  }

  const loadUserHugs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: hugsGiven } = await supabase
        .from("post_hugs")
        .select("post_id")
        .eq("user_id", user.id)

      if (hugsGiven) {
        setHuggedPosts(new Set(hugsGiven.map(h => h.post_id)))
      }

      // Count hugs received on user's own posts
      const { data: myPosts } = await supabase
        .from("community_posts")
        .select("id")
        .eq("user_id", user.id)

      if (myPosts && myPosts.length > 0) {
        const myPostIds = myPosts.map(p => p.id)
        const { count } = await supabase
          .from("post_hugs")
          .select("*", { count: "exact", head: true })
          .in("post_id", myPostIds)
        setTotalHugsReceived(count || 0)
      }
    } catch (err) {
    }
  }

  const toggleHug = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { toast.error("Please sign in"); return }

      const isHugged = huggedPosts.has(postId)

      if (isHugged) {
        await supabase.from("post_hugs").delete().eq("post_id", postId).eq("user_id", user.id)
        setHuggedPosts(prev => { const s = new Set(prev); s.delete(postId); return s })
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, hugs_count: Math.max(0, (p.hugs_count || 0) - 1) } : p))
        if (selectedPost?.id === postId) setSelectedPost(sp => sp ? { ...sp, hugs_count: Math.max(0, (sp.hugs_count || 0) - 1) } : sp)
      } else {
        await supabase.from("post_hugs").insert({ post_id: postId, user_id: user.id })
        setHuggedPosts(prev => new Set(prev).add(postId))
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, hugs_count: (p.hugs_count || 0) + 1 } : p))
        if (selectedPost?.id === postId) setSelectedPost(sp => sp ? { ...sp, hugs_count: (sp.hugs_count || 0) + 1 } : sp)
        toast.success("Hug sent! 🤗")
      }
    } catch (err) {
    }
  }

  const loadReplies = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }
      const { data } = await supabase.from("community_replies").select("*").eq("post_id", postId).order("created_at", { ascending: false })
      if (data) setReplies(data)
    } catch (err) {
    }
  }

  const createPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error("Please fill in all fields")
      return
    }
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const anonymousName = `User${Math.floor(Math.random() * 10000)}`
      if (!user) {
        window.location.href = '/login'
        return
      }
      const { error } = await supabase.from("community_posts").insert({
        user_id: user.id,
        anonymous_name: anonymousName,
        title: newPostTitle,
        content: newPostContent,
        category: newPostCategory,
        is_anonymous: true,
      })
      if (error) {
        toast.error("Failed to create post")
      } else {
        // Award points directly to profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("total_points")
          .eq("id", user.id)
          .single()

        if (profile) {
          await supabase
            .from("profiles")
            .update({ 
              total_points: (profile.total_points || 0) + 3,
              updated_at: new Date().toISOString()
            })
            .eq("id", user.id)
        }
        
        toast.success("Post shared! +3 points")
        setNewPostTitle("")
        setNewPostContent("")
        setActiveTab("explore")
        setPage(1)
        loadPosts(1, searchQuery, filterCategory)
      }
    } catch (err) {
      toast.error("Failed to create post")
    }
    setLoading(false)
  }

  const createReply = async () => {
    if (!newReply.trim() || !selectedPost) return
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const anonymousName = `User${Math.floor(Math.random() * 10000)}`
      if (!user) {
        window.location.href = '/login'
        return
      }
      const { error } = await supabase.from("community_replies").insert({
        post_id: selectedPost.id,
        user_id: user.id,
        anonymous_name: anonymousName,
        content: newReply,
      })
      if (error) {
        toast.error("Failed to post reply")
      } else {
        // Award points directly to profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("total_points")
          .eq("id", user.id)
          .single()

        if (profile) {
          await supabase
            .from("profiles")
            .update({ 
              total_points: (profile.total_points || 0) + 1,
              updated_at: new Date().toISOString()
            })
            .eq("id", user.id)
        }
        
        toast.success("Reply posted! +1 point")
        setNewReply("")
        loadReplies(selectedPost.id)
      }
    } catch (err) {
      toast.error("Failed to post reply")
    }
    setLoading(false)
  }

  const toggleLike = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Please sign in to like posts")
        return
      }

      const isLiked = likedPosts.has(postId)

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id)

        if (!error) {
          // Update local state
          setLikedPosts(prev => {
            const newSet = new Set(prev)
            newSet.delete(postId)
            return newSet
          })

          // Update post likes count
          setPosts(posts.map(p => 
            p.id === postId 
              ? { ...p, likes_count: Math.max(0, p.likes_count - 1) }
              : p
          ))

          if (selectedPost?.id === postId) {
            setSelectedPost({
              ...selectedPost,
              likes_count: Math.max(0, selectedPost.likes_count - 1)
            })
          }

          toast.success("Like removed")
        }
      } else {
        // Like
        const { error } = await supabase
          .from("post_likes")
          .insert({
            post_id: postId,
            user_id: user.id,
          })

        if (!error) {
          // Update local state
          setLikedPosts(prev => new Set(prev).add(postId))

          // Update post likes count
          setPosts(posts.map(p => 
            p.id === postId 
              ? { ...p, likes_count: p.likes_count + 1 }
              : p
          ))

          if (selectedPost?.id === postId) {
            setSelectedPost({
              ...selectedPost,
              likes_count: selectedPost.likes_count + 1
            })
          }

          toast.success("Post liked! ❤️")
        }
      }
    } catch (err) {
      toast.error("Failed to update like")
    }
  }

  const openPost = (post: CommunityPost) => {
    setSelectedPost(post)
    loadReplies(post.id)
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight">Community</h1><p className="text-muted-foreground mt-1">Connect with others on similar journeys (anonymous & safe)</p></div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active Members</CardTitle><Users className="h-4 w-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{activeMembers}</div><p className="text-xs text-muted-foreground">Total users</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Posts</CardTitle><MessageCircle className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalPosts}</div><p className="text-xs text-muted-foreground">Total shared</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Hugs Received</CardTitle><span className="text-lg">🤗</span></CardHeader><CardContent><div className="text-2xl font-bold">{totalHugsReceived}</div><p className="text-xs text-muted-foreground">From the community</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Anonymous</CardTitle><Shield className="h-4 w-4 text-purple-500" /></CardHeader><CardContent><div className="text-2xl font-bold">100%</div><p className="text-xs text-muted-foreground">Privacy protected</p></CardContent></Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="explore">Explore</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="create">Create Post</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="space-y-4">
          <LiveChatRoom />
        </TabsContent>
        
        <TabsContent value="explore" className="space-y-4">
          {selectedPost ? (
            <Card>
              <CardHeader><div className="flex justify-between items-start"><div className="flex-1"><div className="flex items-center gap-2 mb-2"><Badge variant="outline">{selectedPost.anonymous_name}</Badge><span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(selectedPost.created_at))} ago</span></div><h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2><p className="text-muted-foreground">{selectedPost.content}</p><div className="flex gap-2 mt-4"><Badge>{selectedPost.category}</Badge></div></div><Button variant="ghost" size="sm" onClick={() => setSelectedPost(null)}>Close</Button></div></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground"><button onClick={() => toggleLike(selectedPost.id)} className={`flex items-center gap-1 transition-colors ${likedPosts.has(selectedPost.id) ? 'text-pink-500' : 'hover:text-pink-500'}`} aria-label={`Like post`}><Heart className={`h-4 w-4 ${likedPosts.has(selectedPost.id) ? 'fill-current' : ''}`} />{selectedPost.likes_count}</button><button onClick={() => toggleHug(selectedPost.id)} className={`flex items-center gap-1 transition-colors text-base ${huggedPosts.has(selectedPost.id) ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} aria-label="Send hug"><span>🤗</span><span className="text-sm">{selectedPost.hugs_count || 0}</span></button><span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />{replies.length}</span></div>
                <div className="border-t pt-4 space-y-4"><h3 className="font-semibold mb-4">Replies</h3><div className="space-y-4">{replies.map((reply) => (<div key={reply.id} className="border-l-2 border-primary pl-4 py-2"><div className="flex items-center gap-2 mb-2"><Badge variant="outline" className="text-xs">{reply.anonymous_name}</Badge><span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(reply.created_at))} ago</span></div><p className="text-sm">{reply.content}</p></div>))}</div></div>
                <div className="space-y-2"><Textarea placeholder="Write your reply... (anonymous)" value={newReply} onChange={(e) => setNewReply(e.target.value)} rows={3} aria-label="Reply content" /><Button onClick={createReply} disabled={loading} aria-label="Post reply"><Send className="h-4 w-4 mr-2" />{loading ? "Posting..." : "Reply (+1 point)"}</Button></div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryFilter("all")}
                >
                  All
                </Button>
                {COMMUNITY_CATEGORIES.map((cat) => (
                  <Button
                    key={cat.value}
                    variant={filterCategory === cat.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryFilter(cat.value)}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
              <div className="space-y-4">
                {posts.map((post) => (<Card key={post.id} className="cursor-pointer hover:bg-accent/50 transition-colors" role="button" tabIndex={0} onClick={() => openPost(post)} onKeyDown={(e) => e.key === "Enter" && openPost(post)} aria-label={`Open post: ${post.title}`}><CardHeader><div className="flex items-center gap-2 mb-2"><Badge variant="outline">{post.anonymous_name}</Badge><span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.created_at))} ago</span></div><CardTitle className="text-lg">{post.title}</CardTitle><p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p><div className="flex gap-2 mt-2"><Badge className="text-xs">{post.category}</Badge></div></CardHeader><CardContent><div className="flex items-center gap-4 text-sm text-muted-foreground"><button onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }} className={`flex items-center gap-1 transition-colors ${likedPosts.has(post.id) ? 'text-pink-500' : 'hover:text-pink-500'}`} aria-label="Like post"><Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />{post.likes_count}</button><button onClick={(e) => { e.stopPropagation(); toggleHug(post.id); }} className={`flex items-center gap-1 text-base transition-opacity ${huggedPosts.has(post.id) ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`} aria-label="Send hug"><span>🤗</span><span className="text-sm">{post.hugs_count || 0}</span></button><span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />{post.replies_count}</span></div></CardContent></Card>))}
                {posts.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{searchQuery || filterCategory !== "all" ? "No posts match your search." : "No posts yet. Be the first to share!"}</p>
                  </div>
                )}
              </div>
              {totalPosts > PAGE_SIZE && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {Math.ceil(totalPosts / PAGE_SIZE)}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page >= Math.ceil(totalPosts / PAGE_SIZE)}>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        <TabsContent value="create"><Card><CardHeader><CardTitle>Share Your Story</CardTitle><p className="text-sm text-muted-foreground">Your post will be anonymous. Share openly and safely.</p></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><label className="text-sm font-medium">Category</label><Select value={newPostCategory} onValueChange={setNewPostCategory}><SelectTrigger aria-label="Post category"><SelectValue /></SelectTrigger><SelectContent>{COMMUNITY_CATEGORIES.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}</SelectContent></Select></div><div className="space-y-2"><label className="text-sm font-medium">Title</label><Input placeholder="Give your post a title..." value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} aria-label="Post title" /></div><div className="space-y-2"><label className="text-sm font-medium">Content</label><Textarea placeholder="Share your thoughts, experiences, or questions..." value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} rows={6} aria-label="Post content" /></div><Button onClick={createPost} disabled={loading} className="w-full" size="lg" aria-label="Publish post"><Plus className="h-4 w-4 mr-2" />{loading ? "Posting..." : "Share Post (+3 points)"}</Button></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  )
}
