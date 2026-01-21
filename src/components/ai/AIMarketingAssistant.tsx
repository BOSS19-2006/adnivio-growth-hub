import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Loader2, 
  X,
  Minimize2,
  Maximize2 
} from "lucide-react";
import { useAIMarketing } from "@/hooks/useAIMarketing";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIMarketingAssistantProps {
  userType: 'product' | 'service';
  isFullPage?: boolean;
}

export function AIMarketingAssistant({ userType, isFullPage = false }: AIMarketingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: userType === 'product' 
        ? "👋 Hi! I'm your AI Marketing Assistant. I can help you create product descriptions, ad copy, and campaign strategies. What would you like to work on today?"
        : "👋 Hi! I'm your AI Marketing Assistant. I can help you craft compelling service descriptions, lead generation strategies, and promotional content. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const { isLoading, streamAIResponse, error } = useAIMarketing();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    let assistantContent = '';
    
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && prev.length > 1 && prev[prev.length - 2]?.content === userMessage.content) {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: 'assistant', content: assistantContent }];
      });
    };

    try {
      await streamAIResponse(
        'chat',
        {
          message: input,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
          userType,
        },
        updateAssistant,
        () => {}
      );
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Sorry, I encountered an error. Please try again.' 
      }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen && !isFullPage) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 h-12 w-12 md:h-14 md:w-14 rounded-full bg-accent hover:bg-accent/90 shadow-glow z-50"
        size="icon"
      >
        <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-accent-foreground" />
      </Button>
    );
  }

  if (isFullPage) {
    return (
      <Card className="h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)] flex flex-col">
        <div className="flex items-center gap-2 p-3 md:p-4 border-b bg-gradient-premium rounded-t-lg">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-accent rounded-full flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent-foreground" />
          </div>
          <span className="font-semibold text-sm md:text-base text-primary-foreground">AI Marketing Assistant</span>
        </div>
        <ScrollArea className="flex-1 p-3 md:p-4" ref={scrollRef}>
          <div className="space-y-3 md:space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] rounded-lg px-3 py-2 md:px-4 ${message.role === 'user' ? 'bg-accent text-accent-foreground' : 'bg-muted text-foreground'}`}>
                  <p className="text-xs md:text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2 md:px-4"><Loader2 className="h-4 w-4 animate-spin" /></div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-3 md:p-4 border-t">
          <div className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress} placeholder="Ask about marketing..." disabled={isLoading} className="flex-1 text-sm" />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon" className="bg-accent hover:bg-accent/90 h-9 w-9 md:h-10 md:w-10">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`fixed z-50 shadow-premium transition-all duration-300 ${
      isMinimized 
        ? 'bottom-4 right-4 md:bottom-6 md:right-6 w-64 md:w-72 h-12 md:h-14' 
        : 'bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] sm:w-80 md:w-96 h-[70vh] md:h-[500px] max-h-[500px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b bg-gradient-premium rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-accent rounded-full flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent-foreground" />
          </div>
          <span className="font-semibold text-sm md:text-base text-primary-foreground">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 md:h-8 md:w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-3.5 w-3.5 md:h-4 md:w-4" /> : <Minimize2 className="h-3.5 w-3.5 md:h-4 md:w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 md:h-8 md:w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <ScrollArea className="flex-1 p-3 md:p-4 h-[calc(70vh-8rem)] md:h-[380px]" ref={scrollRef}>
            <div className="space-y-3 md:space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] md:max-w-[85%] rounded-lg px-3 py-2 md:px-4 ${
                      message.role === 'user'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-xs md:text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2 md:px-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 md:p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about marketing..."
                disabled={isLoading}
                className="flex-1 text-sm"
              />
              <Button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()}
                size="icon"
                className="bg-accent hover:bg-accent/90 h-9 w-9 md:h-10 md:w-10"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            {error && (
              <p className="text-xs text-destructive mt-2">{error}</p>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
