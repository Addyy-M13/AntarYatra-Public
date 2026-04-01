"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Smile, Users, Wifi, WifiOff, Loader2, MessageSquare, AtSign, Plus, X } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface ChatMessage {
  id: string
  user_id: string
  username: string
  message: string
  created_at: string
  pending?: boolean
  room_id?: string
}

interface UserProfile {
  id: string
  username: string
  status: 'online' | 'offline' | 'away'
}

const EMOJI_LIST = ["😊", "😂", "❤️", "👍", "🎉", "😢", "😭", "🙏", "💪", "✨", "🌟", "💙", "💚", "💛", "🔥", "👏", "🤗", "😍", "🥰", "😌"]

export function LiveChatRoom() {
  const [chatMode, setChatMode] = useState<'global' | 'direct'>('global')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [username, setUsername] = useState("")
  const [onlineCount, setOnlineCount] = useState(0)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [chatEnabled, setChatEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([])
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [showUserList, setShowUserList] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<any>(null)
  const chatModeRef = useRef<'global' | 'direct'>('global')
  const roomIdRef = useRef<string | null>(null)
  const supabase = createClient()

  // Initialize chat
  useEffect(() => {
    const init = async () => {
      try {
        await loadUser()
        await loadOnlineUsers()
        await loadMessages()
        await loadUserCount()
        setupRealtimeSubscription()
        setLoading(false)
      } catch (err) {
        console.error("Init error:", err)
        setLoading(false)
      }
    }

    init()

    // Refresh user list every 15 seconds
    const userListInterval = setInterval(loadOnlineUsers, 15000)

    // Refresh user count every 30 seconds
    const countInterval = setInterval(loadUserCount, 30000)

    // Setup connection monitoring
    const connectionInterval = setInterval(() => {
      // Ping to check connection
      supabase.auth.getUser().catch(() => setIsConnected(false))
    }, 10000)

    return () => {
      clearInterval(userListInterval)
      clearInterval(countInterval)
      clearInterval(connectionInterval)
      if (channelRef.current) {
        channelRef.current.unsubscribe()
      }
      supabase.removeAllChannels()
    }
  }, [])

  const loadUserCount = async () => {
    try {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })

      if (count !== null) {
        setOnlineCount(count)
      }
    } catch (error) {
      console.error("Error loading user count:", error)
    }
  }

  const loadOnlineUsers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get all profiles except current user - no limit
      const { data: users, error } = await supabase
        .from("profiles")
        .select("id, username")
        .neq("id", user.id)
        .order("updated_at", { ascending: false })

      if (error) {
        console.error("Error loading users:", error)
        return
      }

      if (users) {
        setOnlineUsers(users.map(u => ({
          id: u.id,
          username: u.username || 'Anonymous',
          status: 'online' as const
        })))
      }
    } catch (error) {
      console.error("Error loading online users:", error)
    }
  }

  const generateRoomId = (userId1: string, userId2: string): string => {
    // Create consistent room ID regardless of order
    const ids = [userId1, userId2].sort()
    return `${ids[0]}_${ids[1]}`
  }

  const startDirectChat = async (user: UserProfile) => {
    if (!currentUser) return

    const newRoomId = generateRoomId(currentUser.id, user.id)
    setSelectedUser(user)
    setRoomId(newRoomId)
    roomIdRef.current = newRoomId
    setChatMode('direct')
    chatModeRef.current = 'direct'
    setShowUserList(false)

    // Load messages for this room (don't clear first)
    await loadDirectMessages(newRoomId)
  }

  const loadDirectMessages = async (room: string) => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", room)
        .order("created_at", { ascending: true })
        .limit(100)

      if (error) {
        console.error("Error loading direct messages:", error)
        return
      }

      if (data) {
        setMessages(data.filter(m => m.room_id === room))
      }
    } catch (err) {
      console.error("Error in loadDirectMessages:", err)
    }
  }

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setCurrentUser(user)
      
      // Get username from profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single()
      
      if (profile?.username) {
        setUsername(profile.username)
      }
    }
  }

  const loadMessages = async () => {
    try {
      if (chatMode === 'direct' && roomId) {
        await loadDirectMessages(roomId)
        return
      }

      // Load global chat messages
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .is("room_id", null)
        .order("created_at", { ascending: true })
        .limit(100)

      if (error) {
        console.error("Error loading messages - CHAT ERROR:", error?.message, error?.code, error)
        toast.error(`Chat Connection Issue: ${error?.message || 'Unknown error'}`)
        setChatEnabled(false)
        return
      }

      // Even if data is empty, it's OK - just show empty chat
      setMessages(data || [])
      setChatEnabled(true)
    } catch (err) {
      console.error("Error in loadMessages - CRITICAL:", err)
      toast.error("Failed to load chat")
      setChatEnabled(false)
    }
  }

  const setupRealtimeSubscription = useCallback(() => {
    try {
      // Clean up existing subscription only if needed
      if (channelRef.current) {
        channelRef.current.unsubscribe()
      }

      // Single stable subscription - never recreate
      const channel = supabase
        .channel('stable_chat_channel', {
          config: {
            broadcast: { self: true },
          }
        })
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages'
          },
          (payload) => {
            const newMsg = payload.new as ChatMessage

            // Use refs to get current values without re-creating this function
            const mode = chatModeRef.current
            const room = roomIdRef.current

            // Filter messages based on current mode
            let shouldAdd = false
            if (mode === 'direct' && room) {
              shouldAdd = newMsg.room_id === room
            } else if (mode === 'global') {
              shouldAdd = newMsg.room_id === null || newMsg.room_id === undefined
            }

            if (!shouldAdd) return

            setMessages(prev => {
              if (prev.some(m => m.id === newMsg.id)) return prev
              return [...prev, newMsg]
            })
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true)
            setChatEnabled(true)
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setIsConnected(false)
          }
        })

      channelRef.current = channel
    } catch (err) {
      console.error("Error setting up realtime:", err)
      setIsConnected(false)
    }
  }, [supabase])

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser) {
      if (!currentUser) {
        toast.error("Please sign in to send messages")
      }
      return
    }

    const messageText = newMessage.trim()
    setNewMessage("")
    setShowEmojiPicker(false)

    try {
      const messageData: any = {
        user_id: currentUser.id,
        username: username || 'Anonymous',
        message: messageText,
      }

      // Add room_id if in direct chat mode
      const mode = chatModeRef.current
      const room = roomIdRef.current
      if (mode === 'direct' && room) {
        messageData.room_id = room
      }

      const { data, error } = await supabase
        .from("chat_messages")
        .insert([messageData])
        .select()

      if (error) {
        console.error("Database error:", error)
        toast.error(`Failed to send: ${error.message}`)
        setNewMessage(messageText)
        return
      }

      if (data) {
        console.log("Message sent successfully:", data)
      }

      // Award points for chat message
      checkChatAchievements(false)
    } catch (err) {
      console.error("Error sending message:", err)
      toast.error("Failed to send message. Check your connection.")
      setNewMessage(messageText)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const checkChatAchievements = async (isVoice: boolean) => {
    if (!currentUser) return

    try {
      // Get total message count for user
      const { count: messageCount } = await supabase
        .from("chat_messages")
        .select("*", { count: "exact", head: true })
        .eq("user_id", currentUser.id)

      // Get voice message count
      const { count: voiceCount } = await supabase
        .from("chat_messages")
        .select("*", { count: "exact", head: true })
        .eq("user_id", currentUser.id)
        .not("voice_url", "is", null)

      // Get existing achievements
      const { data: existingAchievements } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", currentUser.id)

      const existingIds = existingAchievements?.map(a => a.achievement_id) || []
      const newAchievements: any[] = []

      // Check chat message achievements
      const chatAchievements = [
        { id: 'chat_newcomer', requirement: 1, points: 5, name: 'Chat Newcomer', description: 'Send your first message', icon: '💬' },
        { id: 'chat_regular', requirement: 25, points: 30, name: 'Chat Regular', description: 'Send 25 messages', icon: '💭' },
        { id: 'chat_veteran', requirement: 100, points: 100, name: 'Chat Veteran', description: 'Send 100 messages', icon: '🗨️' },
      ]

      for (const achievement of chatAchievements) {
        if (!existingIds.includes(achievement.id) && (messageCount || 0) >= achievement.requirement) {
          newAchievements.push({
            user_id: currentUser.id,
            achievement_id: achievement.id,
            achievement_name: achievement.name,
            achievement_description: achievement.description,
            points_earned: achievement.points,
            icon: achievement.icon,
          })
        }
      }

      // Check voice message achievement
      if (!existingIds.includes('voice_communicator') && (voiceCount || 0) >= 10) {
        newAchievements.push({
          user_id: currentUser.id,
          achievement_id: 'voice_communicator',
          achievement_name: 'Voice Communicator',
          achievement_description: 'Send 10 voice messages',
          points_earned: 50,
          icon: '🎤',
        })
      }

      // Save new achievements
      if (newAchievements.length > 0) {
        await supabase
          .from("user_achievements")
          .insert(newAchievements)

        // Award points
        const totalPoints = newAchievements.reduce((sum, a) => sum + a.points_earned, 0)
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("total_points")
          .eq("id", currentUser.id)
          .single()

        if (profile) {
          await supabase
            .from("profiles")
            .update({ 
              total_points: (profile.total_points || 0) + totalPoints,
              updated_at: new Date().toISOString()
            })
            .eq("id", currentUser.id)
        }

        // Show achievement notification
        newAchievements.forEach(a => {
          toast.success(`🎉 Achievement Unlocked: ${a.achievement_name}!`, {
            description: `+${a.points_earned} points`,
            duration: 5000,
          })
        })
      }
    } catch (err) {
      console.error("Error checking chat achievements:", err)
    }
  }

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  if (loading) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
            <p className="text-muted-foreground">Loading chat room...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!chatEnabled) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Live Chat Room
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md space-y-4">
            <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold">Chat Room Setup Required</h3>
            <p className="text-muted-foreground">
              The chat room database table hasn't been created yet. 
            </p>
            <div className="bg-muted p-4 rounded-lg text-left text-sm">
              <p className="font-medium mb-2">To enable chat:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Go to Supabase Dashboard → SQL Editor</li>
                <li>Run the script from <code className="bg-background px-1 rounded">scripts/setup_chat_room.sql</code></li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
      {/* User List / Mode Selector */}
      <Card className="lg:col-span-1 flex flex-col overflow-hidden border-2">
        <CardHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Connect
            </CardTitle>
            <Badge variant="outline" className="text-xs">{onlineCount} online</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              <Button
                variant={chatMode === 'global' ? 'default' : 'outline'}
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => {
                  setChatMode('global')
                  chatModeRef.current = 'global'
                  setSelectedUser(null)
                  setRoomId(null)
                  roomIdRef.current = null
                  loadMessages()
                }}
              >
                <MessageSquare className="h-3 w-3 mr-2" />
                Global Chat
              </Button>

              <div className="border-t pt-2 mt-2">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Direct Chat</p>
                {onlineUsers.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No users available</p>
                ) : (
                  <div className="space-y-1">
                    {onlineUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => startDirectChat(user)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                          selectedUser?.id === user.id
                            ? 'bg-primary/20 border border-primary/40'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="truncate">{user.username}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-3 flex flex-col overflow-hidden border-2">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-base">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                {chatMode === 'global' ? (
                  <MessageSquare className="h-5 w-5 text-primary" />
                ) : (
                  <AtSign className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold">
                  {chatMode === 'global' ? 'Community Chat' : `Chat with ${selectedUser?.username}`}
                </div>
                <div className="text-xs text-muted-foreground font-normal">
                  {chatMode === 'global' ? 'Real-time global chat' : 'Private & encrypted'}
                </div>
              </div>
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                isConnected
                  ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-red-500/10 border border-red-500/20'
              }`}>
                {isConnected ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-600 animate-pulse" />
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-red-600" />
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">Reconnecting...</span>
                  </>
                )}
              </div>

              {chatMode === 'direct' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setChatMode('global')
                    chatModeRef.current = 'global'
                    setSelectedUser(null)
                    setRoomId(null)
                    roomIdRef.current = null
                    loadMessages()
                  }}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 h-full">
            <div className="space-y-6 pb-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12">
                  <Users className="h-16 w-16 mb-4 opacity-30" />
                  <h3 className="text-lg font-medium mb-2">
                    {chatMode === 'global' ? 'No messages yet' : `Start the conversation`}
                  </h3>
                  <p className="text-sm">
                    {chatMode === 'global' ? 'Be the first to start talking! 👋' : 'Say hello and break the ice! 💬'}
                  </p>
                </div>
              )}

              {messages.map((msg) => {
                const isOwnMessage = msg.user_id === currentUser?.id

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <Avatar className="h-9 w-9 flex-shrink-0 border-2 shadow-sm">
                      <AvatarFallback className="text-xs font-medium bg-primary/10">
                        {msg.username?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>

                    <div className={`flex flex-col gap-1 max-w-[70%] min-w-0 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">
                          {isOwnMessage ? 'You' : msg.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                        </span>
                      </div>

                      <div
                        className={`px-4 py-2.5 shadow-md rounded-2xl transition-all flex items-center gap-2 ${
                          isOwnMessage
                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                            : 'bg-secondary text-secondary-foreground rounded-tl-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
                        {msg.pending && (
                          <Loader2 className="h-3 w-3 animate-spin flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4 bg-muted/20 backdrop-blur-sm">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder={chatMode === 'global' ? "Chat with everyone..." : "Send a message..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-12"
                  maxLength={500}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="h-4 w-4" />
                </Button>

                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 z-50 bg-popover border rounded-xl shadow-xl p-3">
                    <div className="grid grid-cols-5 gap-2">
                      {EMOJI_LIST.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => addEmoji(emoji)}
                          className="text-2xl hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                size="lg"
                className="h-11 px-6"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {!isConnected ? '⚠️ Reconnecting to chat...' : 'Press Enter to send • Shift+Enter for new line'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
