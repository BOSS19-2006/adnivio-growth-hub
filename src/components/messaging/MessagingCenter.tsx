import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, Search, Plus } from "lucide-react";
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
  participants?: { user_id: string; profiles?: { full_name: string; email: string } }[];
}

const MessagingCenter = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      
      // Subscribe to real-time messages
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
    const { data, error } = await supabase
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

    const uniqueConversations = data?.map(d => d.conversations).filter(Boolean) as Conversation[];
    setConversations(uniqueConversations || []);
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
      console.error('Error sending message:', error);
    } else {
      setNewMessage("");
    }
  };

  const createNewConversation = async () => {
    if (!user) return;

    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();

    if (convError) {
      toast.error("Failed to create conversation");
      return;
    }

    const { error: partError } = await supabase
      .from('conversation_participants')
      .insert({
        conversation_id: conversation.id,
        user_id: user.id
      });

    if (partError) {
      console.error('Error adding participant:', partError);
      return;
    }

    setConversations(prev => [conversation, ...prev]);
    setSelectedConversation(conversation.id);
    toast.success("New conversation created");
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
            <Button size="icon" variant="ghost" onClick={createNewConversation}>
              <Plus className="w-4 h-4" />
            </Button>
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
              <Button variant="link" size="sm" onClick={createNewConversation}>
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
                    <AvatarFallback>C</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Conversation</p>
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
            <div className="p-4 border-b">
              <h4 className="font-semibold">Chat</h4>
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
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MessagingCenter;
