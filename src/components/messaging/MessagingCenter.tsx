import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageCircle, Send, Search, Plus, UserPlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface Conversation {
  id: string;
  updated_at: string;
  participants?: { user_id: string }[];
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  business_name: string | null;
}

const MessagingCenter = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);
  const [conversationParticipants, setConversationParticipants] = useState<Record<string, Profile[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      
      const channel = supabase
        .channel(`messages-${selectedConversation}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${selectedConversation}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    const { data: participantData, error } = await supabase
      .from('conversation_participants')
      .select(`
        conversation_id,
        conversations:conversation_id (
          id,
          updated_at
        )
      `)
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error fetching conversations:', error);
      return;
    }

    const uniqueConversations = participantData
      ?.map(d => d.conversations)
      .filter(Boolean) as Conversation[];
    
    setConversations(uniqueConversations || []);

    // Fetch participants for each conversation
    for (const conv of uniqueConversations || []) {
      fetchParticipants(conv.id);
    }
  };

  const fetchParticipants = async (conversationId: string) => {
    const { data: participants } = await supabase
      .from('conversation_participants')
      .select('user_id')
      .eq('conversation_id', conversationId);

    if (participants) {
      const userIds = participants.map(p => p.user_id).filter(id => id !== user?.id);
      
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .in('user_id', userIds);

        if (profiles) {
          setConversationParticipants(prev => ({
            ...prev,
            [conversationId]: profiles
          }));
        }
      }
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('user_id', user?.id)
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,business_name.ilike.%${query}%`)
      .limit(10);

    if (!error && data) {
      setSearchResults(data);
    }
    setSearching(false);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      searchUsers(userSearch);
    }, 300);
    return () => clearTimeout(debounce);
  }, [userSearch]);

  const startConversation = async (profile: Profile) => {
    if (!user) return;

    // Create new conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();

    if (convError) {
      toast.error("Failed to create conversation");
      return;
    }

    // Add both participants
    const { error: partError } = await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: conversation.id, user_id: user.id },
        { conversation_id: conversation.id, user_id: profile.user_id }
      ]);

    if (partError) {
      console.error('Error adding participants:', partError);
      toast.error("Failed to add participants");
      return;
    }

    setInviteOpen(false);
    setUserSearch("");
    setSearchResults([]);
    fetchConversations();
    setSelectedConversation(conversation.id);
    toast.success(`Started conversation with ${profile.full_name || profile.email}`);
  };

  const inviteToConversation = async (profile: Profile) => {
    if (!selectedConversation) return;

    const { error } = await supabase
      .from('conversation_participants')
      .insert({
        conversation_id: selectedConversation,
        user_id: profile.user_id
      });

    if (error) {
      if (error.code === '23505') {
        toast.error("User is already in this conversation");
      } else {
        toast.error("Failed to invite user");
      }
      return;
    }

    setInviteOpen(false);
    setUserSearch("");
    setSearchResults([]);
    fetchParticipants(selectedConversation);
    toast.success(`Added ${profile.full_name || profile.email} to conversation`);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: selectedConversation,
        sender_id: user.id,
        content: newMessage.trim()
      });

    if (error) {
      toast.error("Failed to send message");
    } else {
      setNewMessage("");
    }
  };

  const getConversationName = (convId: string) => {
    const participants = conversationParticipants[convId] || [];
    if (participants.length === 0) return "New Conversation";
    return participants.map(p => p.full_name || p.email || "User").join(", ");
  };

  return (
    <Card className="h-[600px] flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Messages
            </h3>
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    {selectedConversation ? "Invite to Conversation" : "Start New Conversation"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <ScrollArea className="h-64">
                    {searching ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        {userSearch ? "No users found" : "Type to search for users"}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {searchResults.map((profile) => (
                          <div
                            key={profile.id}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer"
                            onClick={() => 
                              selectedConversation 
                                ? inviteToConversation(profile)
                                : startConversation(profile)
                            }
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>
                                  {(profile.full_name || profile.email || "U").charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {profile.full_name || "No name"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {profile.email}
                                </p>
                                {profile.business_name && (
                                  <p className="text-xs text-muted-foreground">
                                    {profile.business_name}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              {selectedConversation ? "Invite" : "Chat"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">No conversations yet</p>
              <Button variant="link" size="sm" onClick={() => setInviteOpen(true)}>
                Start a new one
              </Button>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b ${
                  selectedConversation === conv.id ? 'bg-muted' : ''
                }`}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {getConversationName(conv.id).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{getConversationName(conv.id)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(conv.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <h4 className="font-semibold">{getConversationName(selectedConversation)}</h4>
              <Button size="sm" variant="outline" onClick={() => setInviteOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              {loading ? (
                <div className="text-center text-muted-foreground">Loading...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          msg.sender_id === user?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start messaging</p>
              <Button variant="link" onClick={() => setInviteOpen(true)}>
                Or start a new conversation
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MessagingCenter;
