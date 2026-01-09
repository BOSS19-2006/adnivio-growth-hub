import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  CreditCard,
  History,
  Loader2,
} from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
}

interface WalletData {
  id: string;
  balance: number;
  currency: string;
}

const WalletDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  const fetchWalletData = async () => {
    if (!user) return;

    try {
      // Fetch wallet
      const { data: walletData, error: walletError } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (walletError) throw walletError;
      if (walletData) {
        setWallet(walletData);

        // Fetch transactions
        const { data: txData, error: txError } = await supabase
          .from("wallet_transactions")
          .select("*")
          .eq("wallet_id", walletData.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (txError) throw txError;
        setTransactions(txData || []);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    if (!user || !wallet || !topUpAmount) return;

    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      // Update wallet balance
      const newBalance = Number(wallet.balance) + amount;
      const { error: updateError } = await supabase
        .from("wallets")
        .update({ balance: newBalance })
        .eq("id", wallet.id);

      if (updateError) throw updateError;

      // Create transaction record
      const { error: txError } = await supabase.from("wallet_transactions").insert({
        wallet_id: wallet.id,
        user_id: user.id,
        amount: amount,
        type: "credit",
        description: "Wallet top-up",
      });

      if (txError) throw txError;

      toast({
        title: "Top-up successful!",
        description: `₹${amount.toFixed(2)} added to your wallet`,
      });

      setTopUpAmount("");
      setIsTopUpOpen(false);
      fetchWalletData();
    } catch (error) {
      console.error("Error during top-up:", error);
      toast({
        title: "Top-up failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Adnivio Wallet</h2>
          <p className="text-muted-foreground">Manage your ad budget and transactions</p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Wallet className="w-8 h-8" />
              <Badge variant="secondary" className="bg-white/20 text-white">
                {wallet?.currency || "INR"}
              </Badge>
            </div>
            <p className="text-sm opacity-80">Available Balance</p>
            <p className="text-4xl font-bold mt-1">₹{Number(wallet?.balance || 0).toFixed(2)}</p>
            <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Funds
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Funds to Wallet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setTopUpAmount(amount.toString())}
                      >
                        ₹{amount}
                      </Button>
                    ))}
                  </div>
                  <Button
                    className="w-full bg-accent hover:bg-accent/90"
                    onClick={handleTopUp}
                    disabled={processing}
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Proceed to Pay
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-2xl font-bold">
                  ₹{transactions
                    .filter((t) => t.type === "credit")
                    .reduce((sum, t) => sum + Number(t.amount), 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {transactions.filter((t) => t.type === "credit").length} credit transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Ad Spend</p>
                <p className="text-2xl font-bold">
                  ₹{transactions
                    .filter((t) => t.type === "debit")
                    .reduce((sum, t) => sum + Number(t.amount), 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {transactions.filter((t) => t.type === "debit").length} debit transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Spend vs Revenue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Ad Spend vs Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Ad Spend</span>
                <span className="font-bold">₹{transactions
                  .filter((t) => t.type === "debit")
                  .reduce((sum, t) => sum + Number(t.amount), 0)
                  .toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Revenue Generated</span>
                <span className="font-bold text-green-600">₹21,610.00</span>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="font-semibold">ROI</span>
                <Badge className="bg-green-100 text-green-700">3.2x</Badge>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">AI Recommendation</p>
                <p className="text-lg font-semibold">
                  Increase budget by ₹200 for estimated 3x higher ROI
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Add funds to start running campaigns</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.type === "credit" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {tx.type === "credit" ? (
                        <ArrowDownLeft className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description || "Transaction"}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-bold ${
                      tx.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}₹{Number(tx.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletDashboard;
